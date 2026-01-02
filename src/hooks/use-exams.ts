import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { Exam } from '@/src/types/ExamStudent';
import { toast } from 'sonner';

export function useExams(studentId?: number) {
  return useQuery({
    queryKey: ['exams', studentId],
    queryFn: async () => {
      const params = studentId ? { studentId } : {};
      const { data } = await api.get<Exam[]>('/ExamStudent', { params });
      return data;
    },
    retry: false,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (exam: Partial<Exam>) => {
      const { data } = await api.post<Exam>('/ExamStudent', exam);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Examen programmé');
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...exam }: Partial<Exam> & { id: number }) => {
      const { data } = await api.put<Exam>(`/ExamStudent/${id}`, exam);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Examen modifié');
    },
  });
}
