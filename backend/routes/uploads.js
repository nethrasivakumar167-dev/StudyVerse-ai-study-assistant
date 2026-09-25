import express from 'express';
import multer from 'multer';
import { Types } from 'mongoose';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Upload from '../models/Upload.js';
import { getGenAIClient } from '../services/llmService.js';

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

export default router;
