import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // your backend URL
});

export default api;

export const useUserStore = defineStore('user', () => {
    const user = reactive({
        token: localStorage.getItem('token'),
        email: null,
        isAdmin: false,
        isLoading: false
    });

    // Computed property to check if logged in
    const isAuthenticated = computed(() => !!user.token);

    // Function to fetch details from the backend
    async function getUserDetails() {
        if (!user.token) return;

        user.isLoading = true;
        try {
            // Uses your axios instance from api.js
            const { data } = await api.get('/users/details');
            user.email = data.email;
            user.isAdmin = data.isAdmin;
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            logout(); // Clear state if token is invalid
        } finally {
            user.isLoading = false;
        }
    }

    function setToken(token) {
        user.token = token;
        localStorage.setItem('token', token);
    }

    function logout() {
        user.token = null;
        user.email = null;
        user.isAdmin = false;
        localStorage.removeItem('token');
    }

    return {
        user,
        isAuthenticated,
        getUserDetails,
        setToken,
        logout
    };
});