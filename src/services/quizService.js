import api from './api';

// Fisher-Yates shuffle of a question's options with correctAnswer remapped,
// so offline/mock quizzes never lock the answer to position A either.
const shuffleOptions = (questions) =>
  (questions || []).map((q) => {
    const options = [...(q.options || [])];
    const correct = options[q.correctAnswer];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return { ...q, options, correctAnswer: options.indexOf(correct) };
  });

export const quizService = {
  // Generate battle quiz for any topic
  generateQuiz: async ({ topic = 'Process Scheduling', difficulty = 'HERO', count = 4 }) => {
    const response = await api.post('/quiz/generate', { topic, difficulty, count });
    return response.data;
  },

  // The user's own submitted quiz attempts (dashboard stats / history)
  getHistory: async () => {
    try {
      const response = await api.get('/quiz/history');
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  },

  // Submit quiz results
  submitQuiz: async (submissionData) => {
    try {
      const response = await api.post('/quiz/submit', submissionData);
      return response.data;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
      const { correctCount, totalQuestions, totalXpEarned } = submissionData;
      const accuracy = Math.round((correctCount / totalQuestions) * 100);

      let rankAchieved = 'RECRUIT';
      if (accuracy >= 90) rankAchieved = 'LEGENDARY';
      else if (accuracy >= 75) rankAchieved = 'SUPERHERO';
      else if (accuracy >= 50) rankAchieved = 'HERO';

      return {
        success: true,
        accuracy,
        correctCount,
        totalQuestions,
        totalXpEarned,
        rankAchieved,
        bonusMessage: accuracy === 100 ? '⚡ FLAWLESS COMBAT VICTORY! +100 BONUS XP' : 'Mission Accomplished!'
      };
    }
  }
};
