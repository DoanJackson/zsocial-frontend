import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use((response) => {
  // Return the full response object or just data depending on preference.
  // Previous code expected response.data to contain the payload.
  // Axios puts the body in response.data.
  // My previous api/index.js returned the JSON body.
  // So here I should return response.data to match that behavior, 
  // OR keep response and let the caller access response.data.
  
  // However, my previous logic in Login.jsx was:
  // if (response.data.success) ...
  // If I return response.data here, then in Login.jsx it becomes:
  // const data = await login(...);
  // if (data.success) ...
  
  // Let's return response.data to simplify.
  if (response && response.data) {
    return response.data;
  }
  return response;
}, (error) => {
  // Handle errors
  throw error;
});

export default axiosClient;
