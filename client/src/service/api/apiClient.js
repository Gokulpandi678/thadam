import axios from "axios";

export const backend_base_url = import.meta.env.VITE_ENV === "prod" ? import.meta.env.VITE_LIVE_BACKEND_BASE_URL : import.meta.env.VITE_LOCAL_BACKEND_BASE_URL

export const apiClient = axios.create({
  baseURL: backend_base_url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

async function refreshToken() {
  return axios.post(
    `${backend_base_url}/auth/refresh`,
    {},
    { withCredentials: true }
  );
}

let isRefreshing = false;
let refreshPromise = null;
let isLoggingOut = false;

const isOnLoginPage = () => window.location.pathname.includes('/login');

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Don't redirect if already on login page
    if (isOnLoginPage()) {
      return Promise.reject(error);
    }

    if (isLoggingOut) {
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (originalRequest.url?.includes("/auth/refresh")) {
      if (!isLoggingOut && !isOnLoginPage()) {
        isLoggingOut = true;
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 401) {
      if (originalRequest._retry) {
        if (!isLoggingOut && !isOnLoginPage()) {
          isLoggingOut = true;
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshToken();
          await refreshPromise;
          isRefreshing = false;
        } else {
          await refreshPromise;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        const refreshStatus = refreshError?.response?.status;

        if ((refreshStatus === 400 || refreshStatus === 401) && !isOnLoginPage()) {
          if (!isLoggingOut) {
            isLoggingOut = true;
            window.location.href = "/login";
          }
        }

        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);