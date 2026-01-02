'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Label } from '@/src/components/ui/label';
import { ExamSlot, ExamCategory, ExamStatus } from '@/src/types/exam';
import { useCreateExamStudent } from '@/src/hooks/use-exam-slots';
import { useExams } from '@/src/hooks/use-exams';
import api from '@/src/lib/api';
import { formatDate } from '@/src/lib/utils';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

interface ScheduleExamDialogProps {
    studentId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultCategory?: ExamCategory;
}

export default function ScheduleExamDialog({
    studentId,
    open,
    onOpenChange,
    defaultCategory = ExamCategory.CODE
}: ScheduleExamDialogProps) {
    const [selectedSlotId, setSelectedSlotId] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<ExamCategory>(defaultCategory);
    const createExamStudent = useCreateExamStudent();
    const { data: studentExams } = useExams(studentId);

    // Fetch active exam slots
    const { data: activeSlots, isLoading } = useQuery({
        queryKey: ['exam-slots', 'active'],
        queryFn: async () => {
            const { data } = await api.get('/ExamSlot', { params: { active: true } });
            return data as ExamSlot[];
        },
        enabled: open,
    });

    // Filter slots to exclude dates where student already has an exam
    const availableSlots = activeSlots?.filter(slot => {
        if (!studentExams) return true;
        // Check if student has an exam on the same date (ignore failed/cancelled if needed, but safer to block all same-day)
        const hasConflict = studentExams.some(exam =>
            new Date(exam.date!).toDateString() === new Date(slot.examDate).toDateString()
        );
        return !hasConflict;
    }) || [];

    const handleConfirm = () => {
        if (!selectedSlotId) return;

        const slot = activeSlots?.find(s => s.id.toString() === selectedSlotId);
        if (!slot) return;

        createExamStudent.mutate({
            studentId: studentId,
            examSlotId: slot.id,
            category: selectedCategory,
            status: ExamStatus.PLANNED,
            date: slot.examDate
        }, {
            onSuccess: () => {
                toast.success("Examen programmé avec succès");
                onOpenChange(false);
            },
            onError: (error: any) => {
                toast.error("Erreur: " + (error?.response?.data?.message || "Conflit de date ou erreur serveur"));
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Programmer un examen</DialogTitle>
                    <DialogDescription>
                        Sélectionnez une session d'examen active pour ce candidat.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Type d'examen (Suggéré)</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={(val) => setSelectedCategory(val as ExamCategory)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ExamCategory.CODE}>Code</SelectItem>
                                <SelectItem value={ExamCategory.CRENEAU}>Créneau</SelectItem>
                                <SelectItem value={ExamCategory.CONDUITE}>Conduite</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Suggéré automatiquement selon la progression.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Session d'examen</Label>
                        <Select
                            value={selectedSlotId}
                            onValueChange={setSelectedSlotId}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={isLoading ? "Chargement..." : "Choisir une date"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSlots.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                        {activeSlots && activeSlots.length > 0 ? "Aucun créneau disponible (conflits de date)" : "Aucune session active"}
                                    </div>
                                ) : (
                                    availableSlots.map((slot) => (
                                        <SelectItem key={slot.id} value={slot.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(slot.examDate)}</span>
                                                <span className="text-xs text-muted-foreground">({slot.wilaya})</span>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {activeSlots && activeSlots.length > 0 && availableSlots.length < activeSlots.length && (
                            <p className="text-xs text-amber-600">
                                Certaines dates sont masquées car le candidat a déjà un examen ce jour-là.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                    <Button onClick={handleConfirm} disabled={!selectedSlotId || createExamStudent.isPending}>
                        {createExamStudent.isPending ? "Programmation..." : "Confirmer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
