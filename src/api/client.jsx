import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000',
    withCredentials: true,
});

// attach token from localStorage to every request
api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        else delete config.headers.Authorization;
    } catch (e) {
        // ignore errors
    }
    return config;
});

export function setAuthToken(token) {
    if (token) {
        localStorage.setItem('access_token', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        localStorage.removeItem('access_token');
        delete api.defaults.headers.common.Authorization;
    }
}

export async function logout() {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        // ignore server errors during logout
    }
    // clear client state
    localStorage.removeItem('access_token');
    delete api.defaults.headers.common.Authorization;
    try { window.location.href = '/login'; } catch (e) { }
}

export default api;
