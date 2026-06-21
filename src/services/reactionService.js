import axiosClient from './axiosClient';

const reactionService = {
  /**
   * Toggle reaction on a target
   */
  toggleReaction: (targetId, targetType) => {
    return axiosClient.post('/api/reactions/toggle', {
      targetId,
      targetType
    });
  },

  /**
   * Get list of reactors for a target
   * targetType can be 'POST' or 'COMMENT'
   */
  getReactors: (targetId, targetType, page = 0, size = 10) => {
    return axiosClient.get('/api/reactions/users', {
      params: {
        targetId,
        targetType,
        page,
        size
      }
    });
  }
};

export default reactionService;
