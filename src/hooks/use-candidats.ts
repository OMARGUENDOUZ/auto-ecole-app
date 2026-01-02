import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { Student, StudentFilters, PaginatedResponse } from '@/src/types/candidat';
import { toast } from 'sonner';

export function useCandidats(filters?: StudentFilters) {
  const page = filters?.page ?? 0;
  const limit = filters?.limit ?? 20;

  return useQuery({
    queryKey: ['candidats', filters],
    queryFn: async () => {
      const params = {
        ...filters,
        page,
        size: limit,
      };

      // Si pagination demandée, attendre une réponse paginée
      if (filters?.page !== undefined || filters?.limit !== undefined) {
        const { data } = await api.get<PaginatedResponse<Student>>('/Student', { params });
        return data;
      }

      // Sinon, retourner un tableau simple (rétrocompatibilité)
      const { data } = await api.get<Student[] | PaginatedResponse<Student>>('/Student', { params });

      // Si c'est déjà paginé, le retourner tel quel
      if (data && typeof data === 'object' && 'content' in data) {
        return data as PaginatedResponse<Student>;
      }

      // Sinon, wrapper dans un format paginé
      return {
        content: data as Student[],
        totalElements: (data as Student[]).length,
        totalPages: 1,
        page: 0,
        size: (data as Student[]).length,
        first: true,
        last: true,
      } as PaginatedResponse<Student>;
    },
    retry: 1,
    retryDelay: 1000,
  });
}

export function useCandidat(id: number) {
  return useQuery({
    queryKey: ['candidat', id],
    queryFn: async () => {
      const { data } = await api.get<Student>(`/Student/${id}`);
      return data;
    },
    enabled: !!id,
    retry: 1,
    retryDelay: 1000,
  });
}

export function useCreateCandidat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidat: Partial<Student>) => {
      const { data } = await api.post<Student>('/Student', candidat);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidats'] });
      toast.success('Candidat créé avec succès');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erreur lors de la création';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateCandidat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Student> & { id: number }) => {
      let currentCandidat = queryClient.getQueryData<Student>(['candidat', id]);

      // If not in cache, fetch from API
      if (!currentCandidat) {
        try {
          const { data } = await api.get<Student>(`/Student/${id}`);
          currentCandidat = data;
        } catch (error) {
          throw new Error('Impossible de récupérer le candidat pour la mise à jour');
        }
      }

      const payload = {
        ...currentCandidat,
        ...updates,
        id,
      };

      const { data: response } = await api.put(`/Student/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidats'] });
      queryClient.invalidateQueries({ queryKey: ['candidat', variables.id] });
      toast.success('Candidat mis à jour');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
    },
  });
}



export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, photoBase64 }: { id: number; photoBase64: string }) => {
      const { data } = await api.post<Student>(`/Student/${id}/photo`, { photoBase64 });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidat', variables.id] });
      toast.success('Photo uploadée');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erreur lors de l\'upload de la photo';
      toast.error(errorMessage);
    },
  });
}

export function useDeleteCandidat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/Student/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidats'] });
      toast.success('Candidat supprimé');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erreur lors de la suppression';
      toast.error(errorMessage);
    },
  });
}
