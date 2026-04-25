import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { API_ROUTES } from '@/src/lib/api-routes';
import { Pricing } from '@/src/types/pricing';
import { toast } from 'sonner';
import { ErrorHandler } from '@/src/lib/errorHandler';

export function usePricings() {
    return useQuery({
        queryKey: ['pricings'],
        staleTime: 5 * 60 * 1000, // 300s — les tarifs changent très rarement
        queryFn: async () => {
            const { data } = await api.get<Pricing[]>(API_ROUTES.pricing.list);
            return data;
        },
    });
}

export function usePricing(id: number) {
    return useQuery({
        queryKey: ['pricing', id],
        staleTime: 5 * 60 * 1000, // 300s
        queryFn: async () => {
            const { data } = await api.get<Pricing>(API_ROUTES.pricing.byId(id));
            return data;
        },
        enabled: !!id,
    });
}

export function useUpdatePricing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Pricing> }) => {
            const response = await api.put(API_ROUTES.pricing.byId(id), data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pricings'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
            toast.success('Tarif mis à jour');
        },
        onError: (error: unknown) => {
            toast.error(ErrorHandler.getErrorMessage(error));
        },
    });
}
