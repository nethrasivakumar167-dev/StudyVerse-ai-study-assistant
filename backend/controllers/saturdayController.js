import { Types } from 'mongoose';
import { generateChatResponse, generateExplanation } from '../services/aiService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const HISTORY_LIMIT = 8; // recent messages sent to the AI as context

const formatTime = (date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// POST /api/saturday/chat (protected)
// Accepts an optional conversationId; creates a new conversation when absent.
// Persists both messages and returns multi-turn context to the AI.
export const chat = asyncHandler(async (req, res) => {
  const { message, context = {}, conversationId } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ message: 'message is required' });
  }

  const cleanMessage = message.trim();

  // Reopen an existing conversation (must belong to this user) or start a new one.
  let conversation = null;
  if (conversationId && Types.ObjectId.isValid(conversationId)) {
    conversation = await Conversation.findOne({ _id: conversationId, user: req.userId });
  }
  const isNew = !conversation;
  if (!conversation) {
    conversation = await Conversation.create({
      user: req.userId,
      title: cleanMessage.replace(/\s+/g, ' ').slice(0, 60)
    });
  }

  // Recent history (fetched BEFORE saving the current user message).
  const historyDocs = isNew
    ? []
    : await Message.find({ conversation: conversation._id })
        .sort({ createdAt: -1 })
        .limit(HISTORY_LIMIT)
        .lean();
  const history = historyDocs.reverse().map((m) => ({ sender: m.sender, text: m.text }));

  const responseData = await generateChatResponse(cleanMessage, context, history);

  await Message.insertMany([
    { conversation: conversation._id, sender: 'user', text: cleanMessage },
    { conversation: conversation._id, sender: 'saturday', text: responseData.text }
  ]);
  await Conversation.updateOne({ _id: conversation._id }, { $set: { updatedAt: new Date() } });

  res.json({
    sender: 'saturday',
    timestamp: formatTime(new Date()),
    text: responseData.text,
    type: responseData.type || (responseData.topic ? 'study' : 'chat'),
    topic: responseData.topic || null,
    suggestedActions: responseData.suggestedActions || [
      'Save to Knowledge Vault',
      'Continue in Knowledge Lab',
      'Battle on this Topic'
    ],
    xpAwarded: responseData.xpAwarded || 25,
    conversationId: conversation._id.toString()
  });
});

// GET /api/saturday/conversations (protected)
export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ user: req.userId })
    .sort({ updatedAt: -1 })
    .limit(20)
    .lean();

  res.json(
    conversations.map((c) => ({
      id: c._id.toString(),
      title: c.title,
      updatedAt: c.updatedAt
    }))
  );
});

// GET /api/saturday/conversations/:id (protected)
export const listMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const conversation = await Conversation.findOne({ _id: id, user: req.userId }).lean();
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const messages = await Message.find({ conversation: conversation._id })
    .sort({ createdAt: 1 })
    .lean();

  res.json(
    messages.map((m) => ({
      id: m._id.toString(),
      sender: m.sender,
      text: m.text,
      timestamp: formatTime(m.createdAt)
    }))
  );
});

// POST /api/explain (protected)
export const explain = asyncHandler(async (req, res) => {
  const { topic, difficulty = 'HERO' } = req.body;

  if (!topic?.trim()) {
    return res.status(400).json({ error: true, message: 'topic is required' });
  }

  const result = await generateExplanation(topic.trim(), difficulty);
  return res.json(result);
});
