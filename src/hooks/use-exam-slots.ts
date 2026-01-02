import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { ExamSlot, ExamStudent } from '@/src/types/exam';
import { toast } from 'sonner';

export function useExamSlots(month?: string) {
  return useQuery({
    queryKey: ['exam-slots', month],
    queryFn: async () => {
      const params = month ? { month } : {};
      const { data } = await api.get<ExamSlot[]>('/ExamSlot', { params });
      return data;
    },
    retry: false,
  });
}

export function useCreateExamSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: Partial<ExamSlot>) => {
      const { data } = await api.post('/ExamSlot', {
        wilaya: 'M\'Sila',
        center: 'Magra',
        active: true,
        ...slot,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-slots'] });
      toast.success('Créneau créé');
    },
  });
}

export function useExamStudents(examSlotId?: number) {
  return useQuery({
    queryKey: ['exam-students', examSlotId],
    queryFn: async () => {
      const params = examSlotId ? { examSlotId } : {};
      const { data } = await api.get<ExamStudent[]>('/ExamStudent', { params });
      return data;
    },
    enabled: !!examSlotId,
    retry: false,
  });
}

export function useCreateExamStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (examStudent: Partial<ExamStudent>) => {
      const { data } = await api.post('/ExamStudent', examStudent);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-students'] });
      queryClient.invalidateQueries({ queryKey: ['exam-slots'] });
      queryClient.invalidateQueries({ queryKey: ['students'] }); // Refresh student lists (status might change)
      toast.success('Candidat ajouté au créneau');
    },
  });
}

export function useDeleteExamStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/ExamStudent/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-students'] });
      queryClient.invalidateQueries({ queryKey: ['exam-slots'] });
      queryClient.invalidateQueries({ queryKey: ['students'] }); // Refresh student lists (status might change)
      toast.success('Candidat retiré du créneau');
    },
  });
}

export function useUpdateExamStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExamStudent> & { id: number }) => {
      const { data } = await api.put(`/ExamStudent/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-students'] });
      queryClient.invalidateQueries({ queryKey: ['exam-slots'] });
      // Invalidate specific student queries if needed, e.g. for progression checks
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Résultat mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    }
  });
}
