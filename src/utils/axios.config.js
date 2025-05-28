import axios from 'axios';
import { sanitizeObject } from './security';
import { getCSRFToken } from './csrf';

const api = axios.create({
    baseURL: 'https://localhost/pertanian/server/api',
    withCredentials: true,
    headers: {
        'Accept': 'application/json'
    },
    httpsAgent: {
        rejectUnauthorized: false // Only for development
    }
});

api.interceptors.request.use(
    (config) => {
        // Add CSRF token to headers
        config.headers['X-CSRF-Token'] = getCSRFToken();
        
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }

        // Don't sanitize if it's FormData
        if (!(config.data instanceof FormData)) {
            if (config.data) {
                config.data = sanitizeObject(config.data);
            }
            if (config.params) {
                config.params = sanitizeObject(config.params);
            }
            // Set content type only if not FormData
            config.headers['Content-Type'] = 'application/json';
        }

        // Log request details for debugging
        console.log('Request Config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data instanceof FormData ? 'FormData' : config.data
        });

        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for sanitizing incoming data
api.interceptors.response.use(
    (response) => {
        if (response.data && typeof response.data === 'object') {
            response.data = sanitizeObject(response.data);
        }
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;