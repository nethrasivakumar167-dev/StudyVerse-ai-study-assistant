import express from 'express';
import multer from 'multer';
import { Types } from 'mongoose';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Upload from '../models/Upload.js';
import Quiz from '../models/Quiz.js';
import { getGenAIClient } from '../services/llmService.js';
import { extractAndParseJson } from '../utils/jsonRepair.js';

const router = express.Router();

// Configure Multer with memoryStorage and 10MB file limit
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported'), false);
    }
  }
});

// Multer error handling wrapper middleware
const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: true, message: 'PDF file exceeds 10MB limit' });
      }
      return res.status(400).json({ error: true, message: err.message });
    } else if (err) {
      return res.status(400).json({ error: true, message: err.message });
    }
    next();
  });
};

// Helper for extracting text with pdf-parse supporting multiple module formats
async function extractTextFromPdfBuffer(buffer) {
  const pdfModule = await import('pdf-parse');
  if (typeof pdfModule.PDFParse === 'function') {
    const parser = new pdfModule.PDFParse({ data: buffer });
    const result = await parser.getText();
    return result?.text || '';
  }
  const pdfParse = pdfModule.default || pdfModule;
  if (typeof pdfParse === 'function') {
    const result = await pdfParse(buffer);
    return result?.text || '';
  }
  throw new Error('Unable to initialize pdf parser');
}

const XP_TABLE = [50, 75, 75, 100];

const QUIZ_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          options: {
            type: 'array',
            items: { type: 'string' }
          },
          correctAnswer: { type: 'integer' },
          explanation: { type: 'string' }
        },
        required: ['question', 'options', 'correctAnswer', 'explanation']
      }
    }
  },
  required: ['questions']
};

function validateAndFormatQuestions(rawList, targetCount) {
  if (!Array.isArray(rawList) || rawList.length === 0) return null;
  const valid = [];
  for (let i = 0; i < rawList.length; i++) {
    const q = rawList[i];
    if (!q || typeof q.question !== 'string' || !q.question.trim()) continue;
    if (!Array.isArray(q.options) || q.options.length !== 4) continue;

    let ca = q.correctAnswer;
    if (!Number.isInteger(ca) || ca < 0 || ca > 3) {
      if (typeof ca === 'string') {
        const cLower = ca.trim().toLowerCase();
        if (cLower === 'a' || cLower === '0') ca = 0;
        else if (cLower === 'b' || cLower === '1') ca = 1;
        else if (cLower === 'c' || cLower === '2') ca = 2;
        else if (cLower === 'd' || cLower === '3') ca = 3;
        else {
          const idx = q.options.findIndex((opt) => String(opt).trim().toLowerCase() === cLower);
          ca = idx !== -1 ? idx : 0;
        }
      } else {
        ca = 0;
      }
    }

    valid.push({
      id: `q${valid.length + 1}`,
      question: String(q.question).trim(),
      options: q.options.map((opt) => String(opt).trim()),
      correctAnswer: ca,
      explanation: String(q.explanation || 'Refer to the uploaded study document.').trim(),
      xp: XP_TABLE[valid.length % XP_TABLE.length]
    });

    if (valid.length >= targetCount) break;
  }
  return valid.length > 0 ? valid : null;
}

/**
 * POST /api/uploads
 * Accepts a single PDF file, extracts text with pdf-parse, saves Upload document.
 */
router.post(
  '/',
  protect,
  uploadMiddleware,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: true, message: 'No PDF file uploaded. Please upload a PDF file.' });
    }

    let extractedText = '';
    try {
      extractedText = await extractTextFromPdfBuffer(req.file.buffer);
    } catch (parseErr) {
      return res.status(400).json({
        error: true,
        message: `Failed to extract text from PDF: ${parseErr.message}`
      });
    }

    const cleanText = extractedText.trim();
    const uploadDoc = await Upload.create({
      user: req.userId,
      filename: req.file.originalname,
      extractedText: cleanText,
      charCount: cleanText.length
    });

    return res.status(201).json({
      id: uploadDoc._id.toString(),
      _id: uploadDoc._id.toString(),
      filename: uploadDoc.filename,
      charCount: uploadDoc.charCount,
      createdAt: uploadDoc.createdAt
    });
  })
);

/**
 * GET /api/uploads
 * Returns the logged-in user's uploads (filename, charCount, createdAt, id), sorted newest first.
 */
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const uploads = await Upload.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(
      uploads.map((u) => ({
        id: u._id.toString(),
        _id: u._id.toString(),
        filename: u.filename,
        charCount: u.charCount || 0,
        createdAt: u.createdAt
      }))
    );
  })
);

/**
 * POST /api/uploads/:id/ask
 * Takes { question }, finds the Upload by id for the logged-in user,
 * truncates extractedText to 30000 chars as context, and queries Gemini with S.A.T.U.R.D.A.Y. system prompt.
 */
router.post(
  '/:id/ask',
  protect,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: true, message: 'Question is required' });
    }

    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: true, message: 'Document upload not found' });
    }

    const uploadDoc = await Upload.findOne({ _id: id, user: req.userId }).lean();
    if (!uploadDoc) {
      return res.status(404).json({ error: true, message: 'Document upload not found' });
    }

    const contextText = (uploadDoc.extractedText || '').slice(0, 30000);
    if (!contextText.trim()) {
      return res.json({
        answer: 'The uploaded document contains no readable text to answer questions from.'
      });
    }

    const systemInstruction = `You are S.A.T.U.R.D.A.Y. (Student Assistant To Understand, Review, & Deliver Academic Yield), an intelligent AI study assistant.
You are helping the student with questions about their uploaded study document titled "${uploadDoc.filename}".

CRITICAL INSTRUCTIONS:
1. Answer the question based ONLY and EXCLUSIVELY on the provided document text.
2. If the answer is not mentioned, explained, or directly deducible from the provided document text, clearly state that the answer is not in the document.
3. Do not make up facts or use outside knowledge not present in the document.
4. Use clear Markdown formatting with bullet points and bold text where helpful.`;

    const userContent = `DOCUMENT TEXT (from "${uploadDoc.filename}"):
"""
${contextText}
"""

QUESTION:
${question.trim()}`;

    const client = getGenAIClient();
    const primaryModel = 'gemini-2.0-flash';
    const fallbackModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    let response;
    try {
      response = await client.models.generateContent({
        model: primaryModel,
        contents: userContent,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });
    } catch (err) {
      if (err?.message?.includes('404') || err?.message?.includes('not found') || err?.status === 404) {
        console.warn(`[Gemini Uploads] Model ${primaryModel} unavailable, falling back to ${fallbackModel}`);
        response = await client.models.generateContent({
          model: fallbackModel,
          contents: userContent,
          config: {
            systemInstruction,
            temperature: 0.2
          }
        });
      } else {
        throw err;
      }
    }

    const answer = response?.text || 'No response generated.';
    return res.json({ answer });
  })
);

/**
 * POST /api/uploads/:id/quiz
 * Generates a Battle Arena quiz based strictly on the uploaded document text.
 */
router.post(
  '/:id/quiz',
  protect,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { numQuestions, count } = req.body || {};

    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: true, message: 'Document upload not found' });
    }

    const uploadDoc = await Upload.findOne({ _id: id, user: req.userId }).lean();
    if (!uploadDoc) {
      return res.status(404).json({ error: true, message: 'Document upload not found' });
    }

    const contextText = (uploadDoc.extractedText || '').slice(0, 30000);
    if (!contextText.trim()) {
      return res.status(400).json({
        error: true,
        message: 'The uploaded document contains no readable text to generate a quiz from.'
      });
    }

    const safeCount = Math.min(Math.max(parseInt(numQuestions || count) || 5, 1), 10);
    const docTitle = uploadDoc.filename.replace(/\.pdf$/i, '').trim();

    const systemInstruction = `You are the Battle Arena exam author and academic quiz generator in StudyVerse.
Generate challenging, high-yield multiple-choice questions based ONLY and EXCLUSIVELY on the provided document text.

Rules:
1. Document Exclusivity: Every single question must test real facts, formulas, principles, definitions, or mechanisms directly mentioned in the document.
2. Exactly 4 Options: Each question must provide exactly 4 distinct options (1 correct answer and 3 realistic distractors).
3. Correct Answer: "correctAnswer" must be a 0-based integer index (0, 1, 2, or 3) corresponding to the correct option.
4. Explanations: Provide a concise, clear explanation derived strictly from the document.
5. Strict JSON: Respond with valid JSON matching the schema with the "questions" array. No markdown fences.`;

    const userPrompt = `DOCUMENT TEXT (from "${uploadDoc.filename}"):
"""
${contextText}
"""

Generate exactly ${safeCount} multiple-choice battle quiz questions testing mastery of the document text above.`;

    const client = getGenAIClient();
    const primaryModel = 'gemini-2.0-flash';
    const fallbackModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    const callGemini = async (model, promptExtra = '') => {
      return await client.models.generateContent({
        model,
        contents: userPrompt + promptExtra,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: QUIZ_SCHEMA
        }
      });
    };

    let rawResponseText = '';
    try {
      const response = await callGemini(primaryModel);
      rawResponseText = response?.text || '';
    } catch (err) {
      if (err?.message?.includes('404') || err?.message?.includes('not found') || err?.status === 404) {
        console.warn(`[Gemini Quiz] Model ${primaryModel} unavailable, falling back to ${fallbackModel}`);
        const response = await callGemini(fallbackModel);
        rawResponseText = response?.text || '';
      } else {
        throw err;
      }
    }

    let parsed = extractAndParseJson(rawResponseText);
    let questions = parsed?.questions || (Array.isArray(parsed) ? parsed : null);
    let formattedQuestions = validateAndFormatQuestions(questions, safeCount);

    // If parsing or validation failed, retry once with a stricter instruction
    if (!formattedQuestions) {
      console.warn('[Gemini Quiz] Initial JSON parse/validation failed, retrying with stricter instruction...');
      try {
        const retryModel = process.env.GEMINI_MODEL || fallbackModel;
        const retryResponse = await callGemini(
          retryModel,
          '\n\nIMPORTANT: You must return only valid, parsable JSON matching the schema. No markdown fences.'
        );
        parsed = extractAndParseJson(retryResponse?.text || '');
        questions = parsed?.questions || (Array.isArray(parsed) ? parsed : null);
        formattedQuestions = validateAndFormatQuestions(questions, safeCount);
      } catch (retryErr) {
        console.error('[Gemini Quiz Retry Error]:', retryErr.message);
      }
    }

    if (!formattedQuestions || formattedQuestions.length === 0) {
      return res.status(502).json({
        error: true,
        message: 'Gemini AI failed to generate structured quiz questions from the document. Please retry.'
      });
    }

    // Save generated quiz tagged with sourceUpload
    const quiz = await Quiz.create({
      user: req.userId,
      topic: docTitle || 'Document Intel',
      difficulty: 'HERO',
      questions: formattedQuestions,
      sourceUpload: uploadDoc._id
    });

    return res.status(201).json({
      quizId: quiz._id.toString(),
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      totalQuestions: formattedQuestions.length,
      totalPossibleXp: formattedQuestions.reduce((acc, q) => acc + (q.xp || 50), 0) + 100,
      questions: formattedQuestions
    });
  })
);

export default router;
