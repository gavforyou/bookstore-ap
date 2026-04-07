import axios from "axios";

// Create an instance of axios that we can use throughout our application
// Use the environment variable VITE_BOOKSTORE_API to set the base URL for our API
const baseURL = import.meta.env.VITE_BOOKSTORE_API || 'http://localhost:4000';

console.log('API Base URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
});

// Add an interceptor to add the Authorization header to all our requests
// This is so that we can send the token to the server on each request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // Add the Authorization header with the token
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request to:', config.url, 'with token:', token ? 'Yes' : 'No');
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

// Export the instance of axios so that we can use it in our components
export default api;
