import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAppStore } from './stores/app';

const instance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const appStore = useAppStore();
  if (appStore.csrfToken && config.method?.toUpperCase() !== 'GET') {
    config.headers['X-CSRF-Token'] = appStore.csrfToken;
  }
  
  return config;
}, 
(error: Error) => {
  return Promise.reject(error);
});

// TODO Connect API calls to global error handler
instance.interceptors.response.use(
  (response: AxiosResponse) => { 
    updateCsrfTokenFromAPIResponse(response);
    return response 
  },
  (error) => {
    if (error.response) {
      updateCsrfTokenFromAPIResponse(error.response);
    }
    console.log("error handler switchboard here?");
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Maybe redirect to login or refresh token
    }
    
    if (error.response?.status === 403) {
      // Handle forbidden access
    }
    // Optional: log errors or show global error notification
    return Promise.reject(error)
  }
)

const updateCsrfTokenFromAPIResponse = (response: AxiosResponse) => {
  const token = response.headers['x-csrf-token'];
  if (token) {
    const appStore = useAppStore();
    appStore.setCsrfToken(token);
  }
}

export default instance;