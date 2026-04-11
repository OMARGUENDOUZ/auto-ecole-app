import axios from 'axios';
import { safeLocalStorage } from '@/src/hooks/use-storage';
import { getLocalizedLoginPath } from '@/src/lib/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // envoie le cookie HttpOnly auth_token (Sprint 3)
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

      // Nettoyer le cookie non-HttpOnly résiduel si présent
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; Path=/; Max-Age=0; SameSite=Strict';
      }

      /**
       * Pattern event-driven : au lieu d'appeler window.location.href directement
       * (ce qui casserait le router Next.js et les tests), on dispatch un CustomEvent.
       *
       * Le composant AuthListener (ou le middleware) écoute cet événement et
       * effectue la redirection via useRouter().push() — ce qui préserve l'état React.
       *
       * Écouter avec :
       *   window.addEventListener('auth:unauthorized', (e) => {
       *     router.push(e.detail.redirectTo);
       *   });
       */
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('auth:unauthorized', {
            detail: {
              redirectTo: getLocalizedLoginPath(window.location.pathname),
            },
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;

