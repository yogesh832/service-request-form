// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://5vwd9w13-5000.inc1.devtunnels.ms/', // tumhara backend base URL
  withCredentials: true, // agar tum login system ya cookies use kar rahe ho
});

export default axiosInstance;
