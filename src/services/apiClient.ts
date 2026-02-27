import axios from 'axios';

// Get base URL from Vite env variables, fallback to window.location.origin if relative route
const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || window.location.origin;

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Required for session-based auth (cookies)
    withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            // Si cualquier endpoint da 401 (excepto /me al inicio), es que la sesión se perdió
            if (status === 401 && !error.config.url.includes('/api/auth/me')) {
                console.warn('Sesión expirada o inválida');
                localStorage.removeItem('user');
                // Podríamos redirigir aquí, pero es mejor que el componente lo maneje
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
