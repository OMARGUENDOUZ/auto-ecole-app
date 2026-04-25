import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { API_ROUTES } from '@/src/lib/api-routes';
import { Instructor, CreateInstructorInput, UpdateInstructorInput } from '@/src/types/instructor';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { ErrorHandler } from '@/src/lib/errorHandler';

export function useInstructors() {
    return useQuery({
        queryKey: ['instructors'],
        staleTime: 2 * 60 * 1000, // 120s — les données moniteurs changent rarement
        queryFn: async () => {
            const { data } = await api.get<Instructor[]>(API_ROUTES.instructors.list);
            return data;
        },
    });
}

export function useCreateInstructor() {
    const queryClient = useQueryClient();
    const t = useTranslations('instructors');

    return useMutation({
        mutationFn: async (newInstructor: CreateInstructorInput) => {
            const { data } = await api.post(API_ROUTES.instructors.list, newInstructor);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructors'] });
            toast.success(t('saveSuccess'));
        },
        onError: (error: unknown) => {
            toast.error(ErrorHandler.getErrorMessage(error));
        },
    });
}

export function useUpdateInstructor() {
    const queryClient = useQueryClient();
    const t = useTranslations('instructors');

    return useMutation({
        mutationFn: async (updatedInstructor: UpdateInstructorInput) => {
            const { data } = await api.put(API_ROUTES.instructors.byId(updatedInstructor.id), updatedInstructor);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructors'] });
            toast.success(t('saveSuccess'));
        },
        onError: (error: unknown) => {
            toast.error(ErrorHandler.getErrorMessage(error));
        },
    });
}

export function useDeleteInstructor() {
    const queryClient = useQueryClient();
    const t = useTranslations('instructors');

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(API_ROUTES.instructors.byId(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructors'] });
            toast.success(t('deleteSuccess'));
        },
        onError: (error: unknown) => {
            toast.error(ErrorHandler.getErrorMessage(error));
        },
    });
}
