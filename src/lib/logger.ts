/**
 * Système de logging centralisé
 * En développement: log vers console
 * En production: peut être étendu pour envoyer vers un service externe (Sentry, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry = this.formatMessage(level, message, data);

    if (this.isDevelopment) {
      // En développement, utiliser console avec couleurs
      switch (level) {
        case 'debug':
          console.debug('🔍', entry);
          break;
        case 'info':
          console.info('ℹ️', entry);
          break;
        case 'warn':
          console.warn('⚠️', entry);
          break;
        case 'error':
          console.error('❌', entry);
          break;
      }
    } else {
      // En production, envoyer vers un service de logging
      // TODO: Intégrer avec Sentry, LogRocket, ou autre service
      if (level === 'error') {
        // Seulement les erreurs en production
        console.error(entry);
      }
    }
  }

  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: unknown): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack, name: error.name }
      : error;
    this.log('error', message, errorData);
  }
}

export const logger = new Logger();

