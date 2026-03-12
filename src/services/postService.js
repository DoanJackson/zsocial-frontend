import axiosClient from './axiosClient';

const postService = {
  getFriendsFeed: (size = 10, lastPostId = null) => {
    const params = { size };
    if (lastPostId) {
      params.lastPostId = lastPostId;
    }
    return axiosClient.get('/api/posts/feeds/friends', { params });
  },
  getSuggestedFeed: (size = 10, lastPostId = null) => {
    const params = { size };
    if (lastPostId) {
      params.lastPostId = lastPostId;
    }
    return axiosClient.get('/api/posts/feeds/suggested', { params });
  },
  getUserPosts: (userId, page = 0, size = 5, sortField = 'id', sortDirection = 'DESC') => {
    return axiosClient.get(`/api/posts/users/${userId}`, {
      params: { page, size, sortField, sortDirection },
    });
  },

  searchPosts: (keyword, size = 4, lastPostId = null) => {
    const params = { keyword, size };
    if (lastPostId) params.lastPostId = lastPostId;
    return axiosClient.get('/api/posts/search', { params });
  },

  createPost: (postData, files) => {
    const formData = new FormData();
    formData.append('content', postData.content);
    if (postData.title) {
      formData.append('title', postData.title);
    }
    formData.append('status', postData.status || 'PUBLIC');
    
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }

    return axiosClient.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deletePost: (postId) => {
    return axiosClient.delete(`/api/posts/${postId}`);
  },
};

export default postService;
