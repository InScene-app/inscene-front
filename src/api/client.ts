import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
});

function getTokenExpiry(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return typeof payload.exp === 'number' ? payload.exp : null;
    } catch {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem('access_token');
    delete api.defaults.headers.common.Authorization;
}

// Vérifie l'expiration avant chaque requête
api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('access_token');
        if (token) {
            const exp = getTokenExpiry(token);
            if (exp && Date.now() / 1000 > exp) {
                // Token expiré — nettoyer et rediriger sans envoyer la requête
                clearSession();
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(new axios.Cancel('Token expiré'));
            }
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
    } catch (e) {
        // ignore errors
    }
    return config;
});

// Catch les 401 côté réponse (token révoqué ou invalide côté serveur)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearSession();
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export function setAuthToken(token: string | null) {
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
