import axiosClient from './axiosClient';

const commentService = {
  getCommentsByPostId: (postId, page = 0, size = 10, sortField = 'id', sortDirection = 'ASC') => {
    return axiosClient.get(`/api/posts/${postId}/comments`, {
      params: {
        page,
        size,
        sortField,
        sortDirection,
      },
    });
  },

  createComment: (postId, content, parentId = null, files = []) => {
    const formData = new FormData();
    formData.append('content', content);
    if (parentId) {
      formData.append('parentId', parentId);
    }
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }

    return axiosClient.post(`/api/posts/${postId}/comments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getReplies: (commentId, page = 0, size = 10, sortField = 'id', sortDirection = 'ASC') => {
    return axiosClient.get(`/api/comments/${commentId}/replies`, {
      params: { page, size, sortField, sortDirection },
    });
  },

  deleteComment: (commentId) => {
    return axiosClient.delete(`/api/comments/${commentId}`);
  },
};

export default commentService;
