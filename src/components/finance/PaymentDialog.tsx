'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Loader2, DollarSign, CheckCircle2, CreditCard } from 'lucide-react';
import api from '@/src/lib/api';
import { Invoice, PaymentStatus } from '@/src/types/finance';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface PaymentDialogProps {
    studentId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentName?: string;
}

export function PaymentDialog({ studentId, open, onOpenChange, studentName }: PaymentDialogProps) {
    const t = useTranslations('finance');
    const [amount, setAmount] = useState('');
    const queryClient = useQueryClient();

    // Fetch/Generate Invoice on open
    const { data: invoice, isLoading: isLoadingInvoice, refetch } = useQuery({
        queryKey: ['invoice', studentId],
        queryFn: async () => {
            if (!studentId) return null;
            // Using generate endpoint to get latest up-to-date calculation
            const { data } = await api.post<Invoice>(`/Invoice/generate/${studentId}`);
            return data;
        },
        enabled: !!studentId && open,
    });

    const recordPayment = useMutation({
        mutationFn: async (payAmount: number) => {
            if (!studentId) return;
            const { data } = await api.post('/Payment/record', null, {
                params: { studentId, amount: payAmount }
            });
            return data;
        },
        onSuccess: () => {
            toast.success(t('saveSuccess'));
            setAmount('');
            refetch(); // Refresh invoice to show new balance
            queryClient.invalidateQueries({ queryKey: ['candidats'] }); // Update list if needed
        },
        onError: () => {
            toast.error(t('saveError'));
        }
    });

    const handlePayment = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) {
            toast.error(t('invalidAmount'));
            return;
        }
        recordPayment.mutate(val);
    };

    const balance = invoice ? (invoice.totalAmount - invoice.paidAmount) : 0;
    const isPaid = invoice?.status === PaymentStatus.PAID;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    {studentName && <DialogDescription>{t('candidat')}: {studentName}</DialogDescription>}
                </DialogHeader>

                {isLoadingInvoice ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : invoice ? (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                        {/* Summary Card */}
                        <div className="bg-muted/40 p-4 rounded-lg space-y-2">
                            <h3 className="font-semibold mb-2">{t('invoiceDetails')}</h3>
                            <div className="space-y-1">
                                {invoice.breakdown && (() => {
                                    try {
                                        const items = JSON.parse(invoice.breakdown);
                                        return items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{item.description}</span>
                                                <span>{item.amount} DA</span>
                                            </div>
                                        ));
                                    } catch (e) { return null; }
                                })()}
                            </div>

                            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                                <span>{t('totalToPay')}:</span>
                                <span>{invoice.totalAmount} DA</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>{t('alreadyPaid')}:</span>
                                <span>{invoice.paidAmount} DA</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t mt-2">
                                <span>{t('remainingToPay')}:</span>
                                <span>{balance > 0 ? balance : 0} DA</span>
                            </div>
                        </div>

                        {/* Payment History */}
                        {invoice.paymentHistory && invoice.paymentHistory.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">{t('paymentHistory')}</h3>
                                <div className="border rounded-md divide-y">
                                    {invoice.paymentHistory.map((payment: any) => (
                                        <div key={payment.id} className="flex justify-between p-2 text-sm">
                                            <span>{new Date(payment.date).toLocaleDateString()}</span>
                                            <span className="font-medium text-green-600">+{payment.amount} DA</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Input */}
                        {!isPaid && balance > 0 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">{t('newPayment')}</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder={t('amountPlaceholder')}
                                            className="pl-9"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handlePayment}
                                    disabled={recordPayment.isPending}
                                >
                                    {recordPayment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('savePayment')}
                                </Button>
                            </div>
                        )}

                        {isPaid && (
                            <div className="flex items-center justify-center text-green-600 font-medium py-4 bg-green-50 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                {t('allPaid')}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-4 text-destructive">
                        {t('loadError')}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
