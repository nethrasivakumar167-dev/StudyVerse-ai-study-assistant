/**
 * Google Gemini LLM Service for StudyVerse using @google/genai SDK.
 * 
 * Features:
 * - Real Google Gemini model (default: gemini-2.5-flash) via official @google/genai SDK.
 * - Structured JSON output (responseSchema + responseMimeType: 'application/json').
 * - Multi-turn conversational chat with history context.
 * - Response validation, auto-repair, and 1-attempt retry on malformed responses.
 * - Explicit 503 (missing key) and 502 (generation/upstream failure) errors — zero fake simulation.
 * - Dev logging per call: e.g. [Gemini] Generating quiz for topic: X
 */

import { GoogleGenAI } from '@google/genai';
import { extractAndParseJson } from '../utils/jsonRepair.js';

/**
 * Helper to safely extract and clean GEMINI_API_KEY.
 * Trims whitespace and removes surrounding single or double quotes.
 */
export const getCleanApiKey = () => {
  const raw = process.env.GEMINI_API_KEY;
  if (!raw || typeof raw !== 'string') return '';
  return raw.trim().replace(/^["']|["']$/g, '').trim();
};

/**
 * Returns safe diagnostic metadata for health check without exposing keys.
 */
export const getLLMStatus = () => {
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const apiKey = getCleanApiKey();
  return {
    provider: 'gemini',
    model,
    configured: Boolean(apiKey && apiKey.length > 0)
  };
};

/**
 * Instantiates the GoogleGenAI client singleton or checks configuration.
 */
let genAIClient = null;
let lastApiKey = null;

export const getGenAIClient = () => {
  const apiKey = getCleanApiKey();
  if (!apiKey) {
    const err = new Error('Gemini AI is currently unavailable. Please configure GEMINI_API_KEY in backend/.env.');
    err.status = 503;
    err.code = 'GEMINI_KEY_MISSING';
    throw err;
  }

  if (!genAIClient || lastApiKey !== apiKey) {
    genAIClient = new GoogleGenAI({ apiKey });
    lastApiKey = apiKey;
  }

  return genAIClient;
};

/**
 * Structured Schemas for Gemini responseSchema enforcement.
 */
export const EXPLAIN_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    topic: { type: 'string' },
    subject: { type: 'string' },
    difficulty: { type: 'string' },
    summary: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          type: { type: 'string' },
          content: { type: 'string' }
        },
        required: ['title', 'type', 'content']
      }
    },
    examples: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' }
        },
        required: ['title', 'content']
      }
    },
    commonMistakes: {
      type: 'array',
      items: { type: 'string' }
    },
    examTips: {
      type: 'array',
      items: { type: 'string' }
    },
    keyFacts: {
      type: 'array',
      items: { type: 'string' }
    },
    notes: {
      type: 'object',
      properties: {
        bulletPoints: {
          type: 'array',
          items: { type: 'string' }
        },
        examAlert: { type: 'string' }
      },
      required: ['bulletPoints', 'examAlert']
    }
  },
  required: ['title', 'topic', 'summary', 'sections', 'notes']
};

export const QUIZ_SCHEMA = {
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

export const STUDY_PLAN_SCHEMA = {
  type: 'object',
  properties: {
    protocolName: { type: 'string' },
    summary: { type: 'string' },
    days: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'integer' },
          title: { type: 'string' },
          focus: { type: 'string' },
          objectives: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['day', 'title', 'focus', 'objectives']
      }
    }
  },
  required: ['protocolName', 'summary', 'days']
};

/**
 * Base call to Gemini with retry logic.
 */
export const callGeminiGenerate = async ({
  contents,
  systemInstruction,
  responseSchema = null,
  jsonMode = false,
  temperature = 0.2,
  featureTag = 'Generation',
  topic = ''
}) => {
  const client = getGenAIClient();
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  const logTopic = topic ? ` for topic: "${topic}"` : '';
  console.log(`[Gemini] Generating ${featureTag}${logTopic} using model: ${model}`);

  const config = {
    temperature
  };

  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  if (jsonMode || responseSchema) {
    config.responseMimeType = 'application/json';
    if (responseSchema) {
      config.responseSchema = responseSchema;
    }
  }

  // Attempt generation with up to 4 attempts on transient upstream/quota errors
  let lastError = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config
      });

      const text = response?.text;
      if (typeof text === 'string' && text.trim().length > 0) {
        return text.trim();
      }

      throw new Error('Gemini returned an empty response text');
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Warning] Attempt ${attempt} failed for ${featureTag}:`, err.message);

      if (attempt < 4) {
        // Extract retryDelay if present in error message or error response
        let delayMs = 3000;
        const msg = String(err.message || '');
        const retryMatch = msg.match(/retry in ([0-9.]+)s/i) || msg.match(/retryDelay":"([0-9.]+)s/i);
        if (retryMatch) {
          delayMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1500;
        } else if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
          delayMs = 12000;
        } else if (msg.includes('503') || msg.includes('UNAVAILABLE')) {
          delayMs = attempt * 3000;
        } else {
          delayMs = attempt * 1500;
        }

        console.log(`[Gemini] Waiting ${Math.round(delayMs / 1000)}s before retry attempt ${attempt + 1}...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // If failed after retry, log error without leaking keys and throw 502
  console.error(`[Gemini Error] All attempts failed for ${featureTag}:`, lastError?.message);
  const failureErr = new Error('Gemini AI is currently unavailable. Please try again.');
  failureErr.status = 502;
  failureErr.code = 'GEMINI_API_ERROR';
  throw failureErr;
};

/**
 * Generates structured JSON from Gemini.
 */
export const generateLLMJson = async (systemInstruction, userPrompt, options = {}) => {
  const { responseSchema = null, topic = '', featureTag = 'Structured Data', temperature = 0.2 } = options;

  const rawText = await callGeminiGenerate({
    contents: userPrompt,
    systemInstruction,
    responseSchema,
    jsonMode: true,
    temperature,
    featureTag,
    topic
  });

  const parsed = extractAndParseJson(rawText);
  if (!parsed) {
    // Retry once with raw text parsing
    console.warn('[Gemini JSON] Initial parse failed, attempting secondary parse...');
    const retryText = await callGeminiGenerate({
      contents: `${userPrompt}\nIMPORTANT: Respond with pure, valid JSON ONLY.`,
      systemInstruction,
      responseSchema,
      jsonMode: true,
      temperature: 0.1,
      featureTag: `${featureTag} (Retry)`,
      topic
    });
    const retryParsed = extractAndParseJson(retryText);
    if (retryParsed) return retryParsed;

    const parseErr = new Error('Gemini AI output validation failed. Please try again.');
    parseErr.status = 502;
    throw parseErr;
  }

  return parsed;
};

/**
 * Generates text or multi-turn conversational chat response from Gemini.
 */
export const generateLLMResponse = async (messagesOrPrompt, options = {}) => {
  const { systemInstruction = null, temperature = 0.6, featureTag = 'Chat', topic = '' } = options;

  let contents = messagesOrPrompt;
  let sys = systemInstruction;

  // If array of { role, content / text / parts } messages is passed (e.g. from chat controller)
  if (Array.isArray(messagesOrPrompt)) {
    const formattedContents = [];
    for (const m of messagesOrPrompt) {
      if (!m) continue;
      if (m.role === 'system') {
        const sysText = m.content || m.text || (m.parts?.[0]?.text) || '';
        sys = (sys ? `${sys}\n\n` : '') + sysText;
        continue;
      }

      const role = (m.role === 'model' || m.role === 'assistant' || m.sender === 'saturday') ? 'model' : 'user';
      let text = '';
      if (typeof m === 'string') {
        text = m;
      } else if (Array.isArray(m.parts) && m.parts.length > 0) {
        text = m.parts.map((p) => (typeof p === 'string' ? p : p.text || '')).join('\n');
      } else if (typeof m.content === 'string') {
        text = m.content;
      } else if (typeof m.text === 'string') {
        text = m.text;
      }

      if (text.trim()) {
        formattedContents.push({
          role,
          parts: [{ text: text.trim() }]
        });
      }
    }

    if (!formattedContents.length) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: 'Hello, please assist with my study session.' }]
      });
    }

    // Merge consecutive turns with the same role (Gemini requires alternating roles)
    const merged = [];
    for (const item of formattedContents) {
      if (merged.length > 0 && merged[merged.length - 1].role === item.role) {
        merged[merged.length - 1].parts[0].text += `\n${item.parts[0].text}`;
      } else {
        merged.push({ role: item.role, parts: [{ text: item.parts[0].text }] });
      }
    }

    // Ensure the conversation ends with a user turn
    if (merged.length > 0 && merged[merged.length - 1].role === 'model') {
      merged.push({
        role: 'user',
        parts: [{ text: 'Please continue.' }]
      });
    }

    contents = merged;
  }

  return callGeminiGenerate({
    contents,
    systemInstruction: sys,
    temperature,
    featureTag,
    topic
  });
};
