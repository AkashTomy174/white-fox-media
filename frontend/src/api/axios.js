import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let unauthorizedHandler = null;
let refreshRequest = null;

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const clearStoredAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
};

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return null;

  if (!refreshRequest) {
    refreshRequest = axios
      .post(`${API_BASE_URL}/token/refresh`, { refresh })
      .then((response) => {
        const access = response.data?.access;
        if (access) {
          localStorage.setItem("accessToken", access);
        }
        return access;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes("/token/refresh");

    if (isUnauthorized && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const access = await refreshAccessToken();
        if (access) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch {
        clearStoredAuth();
      }
    }

    if (isUnauthorized && unauthorizedHandler) {
      clearStoredAuth();
      unauthorizedHandler();
    }

    return Promise.reject(error);
  },
);

export default api;
