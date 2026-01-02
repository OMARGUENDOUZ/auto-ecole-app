import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { Instructor, CreateInstructorInput, UpdateInstructorInput } from '@/src/types/instructor';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export function useInstructors() {
    return useQuery({
        queryKey: ['instructors'],
        queryFn: async () => {
            const { data } = await api.get('/moniteur'); // Adjust endpoint as needed
            return data as Instructor[];
        },
    });
}

export function useCreateInstructor() {
    const queryClient = useQueryClient();
    const t = useTranslations('instructors');

    return useMutation({
        mutationFn: async (newInstructor: CreateInstructorInput) => {
            const { data } = await api.post('/moniteur', newInstructor);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructors'] });
            toast.success(t('saveSuccess'));
        },
        onError: () => {
            toast.error('Error creating instructor');
        },
    });
}

export function useUpdateInstructor() {
    const queryClient = useQueryClient();
    const t = useTranslations('instructors');

    return useMutation({
        mutationFn: async (updatedInstructor: UpdateInstructorInput) => {
            const { data } = await api.put(`/moniteur/${updatedInstructor.id}`, updatedInstructor);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructors'] });
            toast.success(t('saveSuccess'));
        },
        onError: () => {
            toast.error('Error updating instructor');
        },
    });
}

export function useDeleteInstructor() {
    const queryClient = useQueryClient();
    const t = useTranslations('instructors');

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/moniteur/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructors'] });
            toast.success(t('deleteSuccess'));
        },
        onError: () => {
            toast.error('Error deleting instructor');
        },
    });
}
