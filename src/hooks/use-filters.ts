import { useState, useCallback, useMemo } from 'react';

export interface UseFiltersReturn<T> {
  /** État actuel des filtres */
  filters: T;
  /** Met à jour un filtre individuel */
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  /** Remet tous les filtres à leurs valeurs par défaut */
  resetFilters: () => void;
  /** Nombre de filtres actifs (différents de leurs valeurs par défaut) */
  activeCount: number;
}

/**
 * Hook générique de gestion de filtres.
 *
 * Usage :
 *   const { filters, setFilter, resetFilters, activeCount } = useFilters({
 *     search: '',
 *     status: 'ALL',
 *     page: 0,
 *   });
 *
 *   // Mettre à jour un filtre
 *   setFilter('search', 'Mohammed');
 *
 *   // Afficher le badge du nombre de filtres actifs
 *   {activeCount > 0 && <Badge>{activeCount}</Badge>}
 *
 * @param defaults - Valeurs initiales des filtres (mémoïser l'objet pour éviter les re-renders)
 */
export function useFilters<T extends Record<string, unknown>>(defaults: T): UseFiltersReturn<T> {
  const [filters, setFilters] = useState<T>(defaults);

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaults);
  }, [defaults]);

  const activeCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      const defaultValue = defaults[key as keyof T];
      return value !== defaultValue && value !== undefined && value !== null && value !== '';
    }).length;
  }, [filters, defaults]);

  return { filters, setFilter, resetFilters, activeCount };
}
