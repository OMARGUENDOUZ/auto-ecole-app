import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { API_ROUTES } from '@/src/lib/api-routes';
import { Exam } from '@/src/types/exam';
import { toast } from 'sonner';
import { ErrorHandler } from '@/src/lib/errorHandler';

/**
 * Récupère la liste des examens, optionnellement filtrée par étudiant.
 */
export function useExams(studentId?: number) {
  return useQuery({
    queryKey: ['exams', studentId],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const params = studentId ? { studentId } : {};
      const { data } = await api.get<Exam[]>(API_ROUTES.examStudents.list, { params });
      return data;
    },
    retry: false,
  });
}

/**
 * Récupère un examen par son identifiant.
 */
export function useExam(id: number) {
  return useQuery({
    queryKey: ['exams', 'detail', id],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const { data } = await api.get<Exam>(API_ROUTES.examStudents.byId(id));
      return data;
    },
    enabled: !!id,
    retry: false,
  });
}

/**
 * Crée un nouvel examen.
 */
export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exam: Partial<Exam>) => {
      const { data } = await api.post<Exam>(API_ROUTES.examStudents.list, exam);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam-students'] });
      toast.success('Examen programmé');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}

/**
 * Met à jour un examen existant (résultat, statut, etc.).
 */
export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...exam }: Partial<Exam> & { id: number }) => {
      const { data } = await api.put<Exam>(API_ROUTES.examStudents.byId(id), exam);
      return data;
    },
    onSuccess: (updatedExam) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam-students'] });
      // Invalider le détail spécifique si l'id est disponible
      if (updatedExam?.id) {
        queryClient.invalidateQueries({ queryKey: ['exams', 'detail', updatedExam.id] });
      }
      toast.success('Examen modifié');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}
