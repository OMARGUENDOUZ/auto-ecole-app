import axios from 'axios';
import { safeLocalStorage } from '@/src/hooks/use-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors pour auth JWT - Utilise safeLocalStorage pour éviter les erreurs SSR
api.interceptors.request.use((config) => {
  const storage = safeLocalStorage();
  const token = storage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor pour gérer les erreurs 401 (non autorisé)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide - nettoyer le storage
      const storage = safeLocalStorage();
      storage.removeItem('auth_token');
      storage.removeItem('refresh_token');
      storage.removeItem('auth_user');
      
      // Rediriger vers login si on est côté client
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
