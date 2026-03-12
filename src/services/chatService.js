import axiosClient from './axiosClient';

const chatService = {
  /**
   * Get list of conversations (cursor-based pagination)
   * @param {number} size
   * @param {string|null} nextCursor
   */
  getConversations: (size = 15, nextCursor = null) => {
    const params = { size };
    if (nextCursor) params.nextCursor = nextCursor;
    return axiosClient.get('/api/chat/conversations', { params });
  },

  /**
   * Get messages in a conversation (cursor-based, scroll-up to load older)
   * @param {number} conversationId
   * @param {number} size
   * @param {number|null} lastMessageId - oldest message id on screen (to load older messages)
   */
  getMessages: (conversationId, size = 20, lastMessageId = null) => {
    const params = { size };
    if (lastMessageId) params.lastMessageId = lastMessageId;
    return axiosClient.get(`/api/chat/conversations/${conversationId}/messages`, { params });
  },

  /**
   * Get members of a conversation
   * @param {number} conversationId
   */
  getMembers: (conversationId) => {
    return axiosClient.get(`/api/chat/conversations/${conversationId}/members`);
  },

  /**
   * Send a message
   * @param {object} payload - { conversationId?, receiverId?, content, files? }
   */
  sendMessage: (payload) => {
    const formData = new FormData();
    if (payload.conversationId) formData.append('conversationId', payload.conversationId);
    if (payload.receiverId) formData.append('receiverId', payload.receiverId);
    if (payload.content) formData.append('content', payload.content);
    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => formData.append('files', file));
    }
    return axiosClient.post('/api/chat', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default chatService;
