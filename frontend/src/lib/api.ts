import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

