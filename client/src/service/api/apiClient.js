import axios from 'axios'


export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    headers: {
        'Content-Type':'application/json'
    },
    withCredentials: true
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
        console.log("Unauthorized - redirecting to login");
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);