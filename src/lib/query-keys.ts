/**
 * Clés de requêtes TanStack Query centralisées.
 *
 * Avantages :
 * - Évite les fautes de frappe et les doublons dans les queryKey
 * - Facilite l'invalidation ciblée (ex: toutes les listes de candidats)
 * - TypeScript inférera les types exacts grâce à `as const`
 *
 * Usage :
 *   queryKey: QUERY_KEYS.candidats.list({ page: 0 })
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.candidats.all })
 */
export const QUERY_KEYS = {
  candidats: {
    all: ['candidats'] as const,
    lists: () => [...QUERY_KEYS.candidats.all, 'list'] as const,
    list: (filters?: object) => [...QUERY_KEYS.candidats.lists(), filters] as const,
    detail: (id: number) => [...QUERY_KEYS.candidats.all, 'detail', id] as const,
  },

  examSlots: {
    all: ['exam-slots'] as const,
    list: (month?: string) => [...QUERY_KEYS.examSlots.all, month] as const,
  },

  examStudents: {
    all: ['exam-students'] as const,
    list: (slotId?: number) => [...QUERY_KEYS.examStudents.all, slotId] as const,
  },

  exams: {
    all: ['exams'] as const,
    list: (studentId?: number) => [...QUERY_KEYS.exams.all, studentId] as const,
    detail: (id: number) => [...QUERY_KEYS.exams.all, 'detail', id] as const,
  },

  instructors: {
    all: ['instructors'] as const,
  },

  pricings: {
    all: ['pricings'] as const,
    detail: (id: number) => [...QUERY_KEYS.pricings.all, id] as const,
  },

  payments: {
    all: ['payments'] as const,
    list: (studentId?: number) => [...QUERY_KEYS.payments.all, studentId] as const,
  },

  invoices: {
    all: ['invoices'] as const,
    list: (studentId?: number) => [...QUERY_KEYS.invoices.all, studentId] as const,
    detail: (id: number) => [...QUERY_KEYS.invoices.all, 'detail', id] as const,
  },
} as const;
