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
  { value: 'A1', labelKey: 'A1' },
  { value: 'A2', labelKey: 'A2' },
  { value: 'B', labelKey: 'B' },
  { value: 'C', labelKey: 'C1' },
  { value: 'D', labelKey: 'D' }
];

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'male' },
  { value: 'FEMALE', label: 'female' }
];
