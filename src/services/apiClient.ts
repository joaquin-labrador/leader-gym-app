import axios from 'axios';

// Get base URL from Vite env variables, fallback to window.location.origin if relative route
const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Required if you use cookies or session-based auth
    // withCredentials: true, 
});

// Request interceptor for inserting tokens
apiClient.interceptors.request.use(
    (config) => {
        // Here you would grab the token if you add Auth later
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling and logging
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data, config } = error.response;
            if (status === 401 || status === 403) {
                console.error(`[API Error ${status}] Unauthorized/Forbidden access to ${config.url}`);
                console.error('Response Data:', data);
                // Optionally handle global logout here if tokens expire
            }
        } else if (error.request) {
            console.error('[API Error] No response received. CORS or Network issue.', error.request);
        } else {
            console.error('[API Error] Request setup failed:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
