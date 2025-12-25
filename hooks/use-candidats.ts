import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Student, StudentFilters } from '@/types/candidat';
import { toast } from 'sonner';

export function useCandidats(filters?: StudentFilters) {
  return useQuery({
    queryKey: ['candidats', filters],
    queryFn: async () => {
      const { data } = await api.get<Student[]>('/Student', { params: filters });
      return data;
    },
    retry: false,
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
    onError: () => {
      toast.error('Erreur lors de la création');
    },
  });
}

export function useUpdateCandidat() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Candidat> & { id: number }) => {
      const currentCandidat = queryClient.getQueryData<Candidat>(['candidat', id]);
      
      if (!currentCandidat) {
        throw new Error('Candidat non trouvé dans le cache');
      }
      
      const payload = {
        id,
        ...currentCandidat,
        ...updates,
      };
      
      console.log('🔵 PUT URL:', `/Student/${id}`);
      console.log('🔵 Payload complet:', payload);
      
      const { data: response } = await api.put(`/Student/${id}`, payload);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidats'] });
      queryClient.invalidateQueries({ queryKey: ['candidat', variables.id] });
      toast.success('Candidat mis à jour');
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
  });
}
