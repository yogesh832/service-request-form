import axios from "axios";

const api = axios.create({
  baseURL: "https://service-request-form-backend-kcy2.onrender.com/api",
});
//http://localhost:5000
// https://service-request-form-backend-kcy2.onrender.com

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

export default api;
