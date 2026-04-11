import axios from 'axios';
import { safeLocalStorage } from '@/src/hooks/use-storage';
import { routing } from '@/src/routing';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function getLocalizedLoginPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const locale = firstSegment && routing.locales.includes(firstSegment as (typeof routing.locales)[number])
    ? firstSegment
    : routing.defaultLocale;

  return `/${locale}/auth/login`;
}

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
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; Path=/; Max-Age=0; SameSite=Lax';
      }
      
      // Rediriger vers login si on est côté client
      if (typeof window !== 'undefined') {
        window.location.href = getLocalizedLoginPath(window.location.pathname);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
