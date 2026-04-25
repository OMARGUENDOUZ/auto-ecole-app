import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { API_ROUTES } from '@/src/lib/api-routes';
import { Student, StudentFilters, StudentRequest, PaginatedResponse } from '@/src/types/candidat';
import { toast } from 'sonner';
import { ErrorHandler } from '@/src/lib/errorHandler';

export function useCandidats(filters?: StudentFilters) {
  const page = filters?.page ?? 0;
  const limit = filters?.limit ?? 20;

  return useQuery({
    queryKey: ['candidats', filters],
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const params = {
        ...filters,
        page,
        size: limit,
      };

      // Le backend retourne toujours PaginatedResponse — pas besoin de wrapping conditionnel
      const { data } = await api.get<PaginatedResponse<Student>>(API_ROUTES.students.list, { params });
      return data;
    },
    retry: 1,
    retryDelay: 1000,
  });
}

export function useCandidat(id: number) {
  return useQuery({
    queryKey: ['candidat', id],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const { data } = await api.get<Student>(API_ROUTES.students.byId(id));
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
    mutationFn: async (candidat: StudentRequest) => {
      const { data } = await api.post<Student>(API_ROUTES.students.list, candidat);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidats'] });
      toast.success('Candidat créé avec succès');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}

export function useUpdateCandidat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: StudentRequest }) => {
      const { data: response } = await api.put<Student>(API_ROUTES.students.byId(id), payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidats'] });
      queryClient.invalidateQueries({ queryKey: ['candidat', variables.id] });
      toast.success('Candidat mis à jour');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, photoBase64 }: { id: number; photoBase64: string }) => {
      const { data } = await api.post<Student>(API_ROUTES.students.photo(id), { photoBase64 });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidat', variables.id] });
      toast.success('Photo uploadée');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}

export function useDeleteCandidat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ROUTES.students.byId(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidats'] });
      toast.success('Candidat supprimé');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}
