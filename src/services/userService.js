import axiosClient from './axiosClient';

const userService = {
  getMe: () => {
    return axiosClient.get('/api/users/me');
  },

  getUserById: (userId) => {
    return axiosClient.get(`/api/users/${userId}`);
  },

  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.patch('/api/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateCover: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.patch('/api/users/me/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  followUser: (targetUserId) => {
    return axiosClient.post(`/api/users/${targetUserId}/follow`);
  },

  unfollowUser: (targetUserId) => {
    return axiosClient.delete(`/api/users/${targetUserId}/unfollow`);
  },
};

export default userService;
