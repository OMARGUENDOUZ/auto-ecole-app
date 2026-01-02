import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { Pricing } from '@/src/types/pricing';

export function usePricings() {
    return useQuery({
        queryKey: ['pricings'],
        queryFn: async () => {
            const { data } = await api.get<Pricing[]>('/Pricing');
            return data;
        }
    });
}

export function usePricing(id: number) {
    return useQuery({
        queryKey: ['pricing', id],
        queryFn: async () => {
            const { data } = await api.get<Pricing>(`/Pricing/${id}`);
            return data;
        },
        enabled: !!id
    });
}

export function useUpdatePricing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Pricing> }) => {
            const response = await api.put(`/Pricing/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pricings'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
        }
    });
}
