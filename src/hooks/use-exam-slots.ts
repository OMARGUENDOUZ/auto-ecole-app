import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { API_ROUTES } from '@/src/lib/api-routes';
import { ExamSlot, ExamStudent } from '@/src/types/exam';
import { toast } from 'sonner';
import { ErrorHandler } from '@/src/lib/errorHandler';

export function useExamSlots(month?: string) {
  return useQuery({
    queryKey: ['exam-slots', month],
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    queryFn: async () => {
      const params = month ? { month } : {};
      const { data } = await api.get<ExamSlot[]>(API_ROUTES.examSlots.list, { params });
      return data;
    },
    retry: false,
  });
}

export function useCreateExamSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slot: Partial<ExamSlot>) => {
      const { data } = await api.post(API_ROUTES.examSlots.list, slot);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-slots'] });
      toast.success('Créneau créé');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}

export function useExamStudents(examSlotId?: number) {
  return useQuery({
    queryKey: ['exam-students', examSlotId],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const params = examSlotId ? { examSlotId } : {};
      const { data } = await api.get<ExamStudent[]>(API_ROUTES.examStudents.list, { params });
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
      const { data } = await api.post(API_ROUTES.examStudents.list, examStudent);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-students'] });
      queryClient.invalidateQueries({ queryKey: ['exam-slots'] });
      queryClient.invalidateQueries({ queryKey: ['candidats'] }); // clé correcte (étape 43)
      toast.success('Candidat ajouté au créneau');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}

export function useDeleteExamStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(API_ROUTES.examStudents.byId(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-students'] });
      queryClient.invalidateQueries({ queryKey: ['exam-slots'] });
      queryClient.invalidateQueries({ queryKey: ['candidats'] }); // clé correcte (étape 43)
      toast.success('Candidat retiré du créneau');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}

export function useUpdateExamStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExamStudent> & { id: number }) => {
      const { data } = await api.put(API_ROUTES.examStudents.byId(id), updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-students'] });
      queryClient.invalidateQueries({ queryKey: ['exam-slots'] });
      queryClient.invalidateQueries({ queryKey: ['candidats'] }); // clé correcte (étape 43)
      toast.success('Résultat mis à jour');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}
