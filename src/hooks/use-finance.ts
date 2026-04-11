import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { API_ROUTES } from '@/src/lib/api-routes';
import { Payment, Invoice } from '@/src/types/finance';
import { toast } from 'sonner';
import { ErrorHandler } from '@/src/lib/errorHandler';

// ─── Paiements ────────────────────────────────────────────────────────────────

/**
 * Récupère la liste des paiements, optionnellement filtrée par étudiant.
 */
export function usePayments(studentId?: number) {
  return useQuery({
    queryKey: ['payments', studentId],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const params = studentId ? { studentId } : {};
      const { data } = await api.get<Payment[]>(API_ROUTES.payments.list, { params });
      return data;
    },
  });
}

/**
 * Enregistre un nouveau paiement et invalide paiements + factures.
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payment: Omit<Payment, 'id'>) => {
      const { data } = await api.post<Payment>(API_ROUTES.payments.list, payment);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Paiement enregistré');
    },
    onError: (error: unknown) => {
      toast.error(ErrorHandler.getErrorMessage(error));
    },
  });
}

// ─── Factures ─────────────────────────────────────────────────────────────────

/**
 * Récupère la liste des factures, optionnellement filtrée par étudiant.
 */
export function useInvoices(studentId?: number) {
  return useQuery({
    queryKey: ['invoices', studentId],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const params = studentId ? { studentId } : {};
      const { data } = await api.get<Invoice[]>(API_ROUTES.invoices.list, { params });
      return data;
    },
  });
}

/**
 * Récupère une facture par son identifiant.
 */
export function useInvoice(id: number) {
  return useQuery({
    queryKey: ['invoices', 'detail', id],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const { data } = await api.get<Invoice>(API_ROUTES.invoices.byId(id));
      return data;
    },
    enabled: !!id,
  });
}
