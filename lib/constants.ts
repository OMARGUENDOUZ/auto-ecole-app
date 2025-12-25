export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Auto-École Manager';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  CANDIDATS: '/candidats',
  CANDIDAT_DETAIL: (id: number) => `/candidats/${id}`,
  CANDIDATS_NON_FINI: '/candidats/non-fini',
  NOUVEAU_CANDIDAT: '/candidats/nouveau',
  PLANNING_EXAMS: '/planning-exams',
  MONITEURS: '/moniteurs',
  RAPPORTS: '/rapports',
};

export const STATUS_OPTIONS = [
  { value: 'REGISTERED', label: 'Inscrit' },
  { value: 'IN_TRAINING', label: 'En Formation' },
  { value: 'READY_FOR_EXAM', label: 'Prêt Examen' },
  { value: 'EXAM_SCHEDULED', label: 'Examen Planifié' },
  { value: 'LICENSED', label: 'Permis Obtenu' },
  { value: 'DROPPED_OUT', label: 'Abandonné' },
];

export const LICENSE_OPTIONS = [
  { value: 'A', label: 'Permis A (Moto)' },
  { value: 'B', label: 'Permis B (Voiture)' },
  { value: 'C', label: 'Permis C (Poids Lourd)' },
  { value: 'D', label: 'Permis D (Transport)' },
];
