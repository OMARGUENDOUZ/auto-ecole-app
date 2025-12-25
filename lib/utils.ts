// lib/utils.ts
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
  } catch {
    return '-';
  }
}

export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '-';
  
  // Nettoyer le numéro (enlever espaces, tirets, parenthèses, +213, etc.)
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Si commence par +213, enlever et ajouter 0 au début
  if (cleaned.startsWith('+213')) {
    cleaned = '0' + cleaned.substring(4);
  } else if (cleaned.startsWith('213')) {
    cleaned = '0' + cleaned.substring(3);
  }
  
  // Vérifier que c'est bien 10 chiffres commençant par 0
  if (!/^0\d{9}$/.test(cleaned)) {
    return phone; // Retourner tel quel si format invalide
  }
  
  // Formater en groupes de 2: 05 55 12 34 56
  return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'REGISTERED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'IN_TRAINING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'READY_FOR_EXAM':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'PASSED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'FAILED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'REGISTERED':
      return 'Inscrit';
    case 'IN_TRAINING':
      return 'En formation';
    case 'READY_FOR_EXAM':
      return 'Prêt pour examen';
    case 'PASSED':
      return 'Diplômé';
    case 'FAILED':
      return 'Échec';
    default:
      return status;
  }
}

