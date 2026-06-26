import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // attach token if needed
  // const token = localStorage.getItem("token");

  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // handle unauthorized globally
      // logout / redirect / refresh token
    }

    return Promise.reject(error);
  },
);
