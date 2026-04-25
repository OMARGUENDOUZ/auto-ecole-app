export const API_ROUTES = {
  students: {
    list: '/students',
    byId: (id: number) => `/students/${id}`,
    photo: (id: number) => `/students/${id}/photo`,
    page: '/students/page',
  },
  examSlots: {
    list: '/exam-slots',
    byId: (id: number) => `/exam-slots/${id}`,
    page: '/exam-slots/page',
  },
  examStudents: {
    list: '/exam-students',
    byId: (id: number) => `/exam-students/${id}`,
    page: '/exam-students/page',
  },
  instructors: {
    list: '/instructors',
    byId: (id: number) => `/instructors/${id}`,
    page: '/instructors/page',
  },
  pricing: {
    list: '/pricing',
    byId: (id: number) => `/pricing/${id}`,
  },
  invoices: {
    list: '/invoices',
    byId: (id: number) => `/invoices/${id}`,
  },
  payments: {
    list: '/payments',
    byId: (id: number) => `/payments/${id}`,
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
} as const;
