import api from './api';
import { LoginCredentials, AuthResponse, User } from '@/src/types/auth';
import { safeLocalStorage } from '@/src/hooks/use-storage';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

export const authService = {
  /**
   * Authentifie un utilisateur avec email et mot de passe
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Stocker les tokens et l'utilisateur
    const storage = safeLocalStorage();
    storage.setItem(TOKEN_KEY, data.token);
    if (data.refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
    storage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data;
  },

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    const storage = safeLocalStorage();
    
    // Appeler l'endpoint de logout si disponible
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignorer les erreurs de logout (token peut être expiré)
    }
    
    // Nettoyer le storage
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
    storage.removeItem(USER_KEY);
  },

  /**
   * Rafraîchit le token d'authentification
   */
  async refreshToken(): Promise<string | null> {
    const storage = safeLocalStorage();
    const refreshToken = storage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return null;
    }

    try {
      const { data } = await api.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });
      
      storage.setItem(TOKEN_KEY, data.token);
      return data.token;
    } catch (error) {
      // Si le refresh échoue, déconnecter l'utilisateur
      authService.logout();
      return null;
    }
  },

  /**
   * Récupère le token actuel
   */
  getToken(): string | null {
    return safeLocalStorage().getItem(TOKEN_KEY);
  },

  /**
   * Récupère l'utilisateur actuel depuis le storage
   */
  getUser(): User | null {
    const userStr = safeLocalStorage().getItem(USER_KEY);
    if (!userStr) {
      return null;
    }
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

