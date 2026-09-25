import api from './api';

export const uploadService = {
  /**
   * Uploads a single PDF file using FormData
   * @param {File} file
   * @param {Function} onUploadProgress - optional callback with percentage
   */
  uploadPdf: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percent);
        }
      }
    });

    return response.data;
  },

  /**
   * Fetches the current user's uploaded documents list
   */
  getUploads: async () => {
    const response = await api.get('/uploads');
    return response.data;
  },

  /**
   * Asks a question scoped to the specified document ID
   * @param {string} uploadId
   * @param {string} question
   */
  askQuestion: async (uploadId, question) => {
    const response = await api.post(`/uploads/${uploadId}/ask`, { question });
    return response.data;
  },

  /**
   * Generates a Battle Arena quiz from the uploaded document
   * @param {string} uploadId
   * @param {number} count
   */
  generateQuiz: async (uploadId, count = 5) => {
    const response = await api.post(`/uploads/${uploadId}/quiz`, { count });
    return response.data;
  }
};

export default uploadService;
