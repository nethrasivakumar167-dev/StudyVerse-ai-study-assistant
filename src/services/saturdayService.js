import api from './api';

export const saturdayService = {
  // Conversational AI handler (conversationId enables ChatGPT-style persistence)
  sendMessage: async (userMessage, context = {}, conversationId = null) => {
    try {
      const response = await api.post('/saturday/chat', {
        message: userMessage,
        context,
        conversationId
      });
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  // Recent conversation list (ChatGPT-style history switcher)
  getConversations: async () => {
    try {
      const response = await api.get('/saturday/conversations');
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  },

  // Full message list of one conversation (null when unavailable)
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/saturday/conversations/${conversationId}`);
      return Array.isArray(response.data) ? response.data : null;
    } catch {
      return null;
    }
  },

  // Knowledge Lab Topic Deep Dive Generator (Topic can be anything!)
  explainTopic: async ({ topic, difficulty = 'HERO' }) => {
    const response = await api.post('/explain', { topic, difficulty });
    return response.data;
  }
};

