import { AxiosError } from 'axios';
import { logger } from './logger';
import { ApiError } from '@/src/types/common';

/**
 * Gestionnaire d'erreurs centralisé
 * Transforme les erreurs techniques en messages utilisateur-friendly
 */

export interface ErrorMessage {
  title: string;
  message: string;
  code?: string;
  /** Erreurs de validation par champ (issues du backend sur 400 / 422) */
  fieldErrors?: Record<string, string>;
}

/** Structure d'erreur retournée par le backend */
interface BackendApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export class ErrorHandler {
  /**
   * Traite une erreur et retourne un message utilisateur-friendly
   */
  static handle(error: unknown): ErrorMessage {
    // Erreur Axios (erreur réseau/API)
    if (error instanceof AxiosError) {
      return this.handleAxiosError(error);
    }

    // Erreur JavaScript standard
    if (error instanceof Error) {
      return this.handleStandardError(error);
    }

    // Erreur inconnue
    logger.error('Erreur inconnue', error);
    return {
      title: 'Erreur',
      message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    };
  }

  /**
   * Gère les erreurs Axios (requêtes API)
   */
  private static handleAxiosError(error: AxiosError): ErrorMessage {
    const status = error.response?.status;
    const data = error.response?.data as BackendApiError | { message?: string; error?: string } | undefined;

    // Extraire les champs depuis BackendApiError si disponibles
    const backendError = data as BackendApiError | undefined;
    const fieldErrors = backendError?.details;
    const userMessage =
      backendError?.message ||
      (data as { message?: string })?.message ||
      (data as { error?: string })?.error;

    logger.error('Erreur API', {
      status,
      url: error.config?.url,
      method: error.config?.method,
      message: userMessage || error.message,
    });

    switch (status) {
      case 400:
        return {
          title: 'Requête invalide',
          message: userMessage || 'Les données envoyées sont invalides.',
          code: 'BAD_REQUEST',
          fieldErrors,
        };

      case 401:
        return {
          title: 'Non autorisé',
          message: 'Votre session a expiré. Veuillez vous reconnecter.',
          code: 'UNAUTHORIZED',
        };

      case 403:
        return {
          title: 'Accès refusé',
          message: "Vous n'avez pas les permissions nécessaires pour effectuer cette action.",
          code: 'FORBIDDEN',
        };

      case 404:
        return {
          title: 'Ressource introuvable',
          message: "La ressource demandée n'a pas été trouvée.",
          code: 'NOT_FOUND',
        };

      case 409:
        return {
          title: 'Conflit',
          message: userMessage || 'Cette ressource existe déjà.',
          code: 'CONFLICT',
        };

      case 422:
        return {
          title: 'Erreur de validation',
          message: userMessage || 'Les données fournies ne sont pas valides.',
          code: 'VALIDATION_ERROR',
          fieldErrors,
        };

      case 500:
        return {
          title: 'Erreur serveur',
          message: "Une erreur s'est produite sur le serveur. Veuillez réessayer plus tard.",
          code: 'SERVER_ERROR',
        };

      case 503:
        return {
          title: 'Service indisponible',
          message: 'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
          code: 'SERVICE_UNAVAILABLE',
        };

      default:
        if (error.code === 'ECONNABORTED') {
          return {
            title: 'Timeout',
            message: 'La requête a pris trop de temps. Veuillez réessayer.',
            code: 'TIMEOUT',
          };
        }

        if (error.code === 'ERR_NETWORK') {
          return {
            title: 'Erreur réseau',
            message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
            code: 'NETWORK_ERROR',
          };
        }

        return {
          title: 'Erreur de connexion',
          message:
            userMessage ||
            error.message ||
            'Une erreur s\'est produite lors de la communication avec le serveur.',
          code: 'CONNECTION_ERROR',
        };
    }
  }

  /**
   * Gère les erreurs JavaScript standard
   */
  private static handleStandardError(error: Error): ErrorMessage {
    logger.error('Erreur standard', error);

    // Messages d'erreur spécifiques
    if (error.message.includes('Network')) {
      return {
        title: 'Erreur réseau',
        message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        code: 'NETWORK_ERROR',
      };
    }

    if (error.message.includes('timeout')) {
      return {
        title: 'Timeout',
        message: 'La requête a pris trop de temps. Veuillez réessayer.',
        code: 'TIMEOUT',
      };
    }

    // Message générique
    return {
      title: 'Erreur',
      message: error.message || "Une erreur inattendue s'est produite.",
    };
  }

  /**
   * Extrait le message d'erreur d'une erreur pour l'afficher dans un toast
   */
  static getErrorMessage(error: unknown): string {
    const errorMessage = this.handle(error);
    return errorMessage.message;
  }
}

// Re-export du type ApiError pour faciliter l'accès
export type { ApiError };
