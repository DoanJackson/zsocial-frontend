import axiosClient from './axiosClient';

const authService = {
  login: (username, password) => {
    return axiosClient.post('/api/sso/login', { username, password });
  },
  register: (userData) => {
    return axiosClient.post('/api/sso/register', userData);
  }
};

export default authService;
