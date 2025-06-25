// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://salka-tech-service-request-backend.onrender.com/', // tumhara backend base URL
  withCredentials: true, // agar tum login system ya cookies use kar rahe ho
});

export default axiosInstance;
