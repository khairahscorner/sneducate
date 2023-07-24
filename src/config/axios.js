import axios from 'axios';
import { API_BASE_URL } from './index';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.defaults.headers.common['Content-Type'] = "application/json";
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = { ...config.headers, "Authorization": `Bearer ${token}` };
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default axiosInstance;