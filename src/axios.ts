import axios, { AxiosInstance } from 'axios';
import { useAppStore } from './stores/app';

const instance: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});


instance.interceptors.request.use((config) => {
  const appStore = useAppStore();
  const csrfToken = appStore.userCsrfToken;
  if (csrfToken) {
    console.log('csrftoken: ', csrfToken)
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  
  return config;
}, (error: Error) => {
  return Promise.reject(error);
});

// TODO Global Error Handler for API calls
instance.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default instance;