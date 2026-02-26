import axios from 'axios';
import { ENV } from '../config/env';

export const apiClient = axios.create({
    baseURL: ENV.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // We can handle global 401, 403, 500 errors here if needed
        // The specific services will handle passing the error to the UI
        return Promise.reject(error);
    }
);
