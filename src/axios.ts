import axios, { AxiosInstance, AxiosResponse } from "axios";

import { useAuthService } from "./composables/useAuthService";
import router from "./router/main";
import { useAppStore } from "./stores/appStore";

const instance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/v1`,
  withCredentials: true
});

instance.interceptors.request.use(
  (config) => {
    const appStore = useAppStore();

    if (appStore.accessToken) {
      config.headers["Authorization"] = `Bearer ${appStore.accessToken}`;
    }

    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// TODO Connect API calls to global error handler
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (error.response.errorCode === "401:ACCESS_TOKEN_EXPIRED") {
        console.log("refresh and retry");
        // refresh accesstoken & retry
      }
      if (
        error.response?.errorCode === "401:REFRESH_TOKEN_EXPIRED" ||
        error.response.errorCode === "401:REFRESH_TOKEN_MISSING"
      ) {
        console.log("log out and force relogin");
        const authService = useAuthService();
        authService.logOut();
        router.push("/");
      }
      // Handle unauthorized access
      // Maybe redirect to login or refresh token
      // If errorCode = AccessToke related, refresh and retry
    }

    if (error.response?.status === 403) {
      // Handle forbidden access
    }
    // Optional: log errors or show global error notification
    return Promise.reject(error);
  }
);

export default instance;
