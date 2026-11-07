import axios from "axios";

import nprogress from "nprogress";
import "nprogress/nprogress.css";

nprogress.configure({ showSpinner: false });

let activeRequests = 0;

const startProgress = () => {
  if (activeRequests === 0) {
    nprogress.start();
  }
  activeRequests += 1;
};

const stopProgress = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    nprogress.done();
  }
};

// Create axios instance
export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false,
});

// Attach token dynamically before every request
apiAuth.interceptors.request.use(
  (config) => {
    startProgress();
    const token = localStorage.getItem("token"); // get the latest token
    if (token && token !== "undefined" && token !== "null") {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    stopProgress();
    return Promise.reject(error);
  },
);

apiAuth.interceptors.response.use(
  (response) => {
    stopProgress();
    return response;
  },
  (error) => {
    stopProgress();
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_type");
      window.dispatchEvent(new Event("auth-unauthorized"));
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
