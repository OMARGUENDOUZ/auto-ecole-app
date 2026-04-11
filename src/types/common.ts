// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: SortDirection;
}

// ─── Tri ─────────────────────────────────────────────────────────────────────

export type SortDirection = 'ASC' | 'DESC';

// ─── Erreurs API ─────────────────────────────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// ─── Catégories de permis ─────────────────────────────────────────────────────
// Valeurs complètes acceptées par le backend

export enum LicenseCategory {
  A1 = 'A1',
  A2 = 'A2',
  A  = 'A',
  B  = 'B',
  C  = 'C',
  C1 = 'C1',
  C2 = 'C2',
  D  = 'D',
  E  = 'E',
}
