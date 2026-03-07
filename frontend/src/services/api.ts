import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Update with your backend URL if different

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url} - Token attached`);
        } else {
            console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url} - No token found`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('[API] 401 Unauthorized detected. Clearing session.');
            // Only redirect if we're not already on the login page to avoid loops
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
