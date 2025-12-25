'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useExamSlots, useCreateExamSlot } from '@/hooks/use-exam-slots';
import { ExamSlot } from '@/types/exam-slot';
import ExamSlotDialog from './ExamSlotDialog';
import ExamSlotStudentList from './ExamSlotStudentList';

export default function PlanningExamsContent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<ExamSlot | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isStudentListOpen, setIsStudentListOpen] = useState(false);

  const monthKey = format(selectedDate, 'yyyy-MM');
  const { data: examSlots, isLoading } = useExamSlots(monthKey);
  const createSlot = useCreateExamSlot();

  const handleCreateSlot = (date: Date) => {
    createSlot.mutate(
      {
        examDate: format(date, 'yyyy-MM-dd'),
        wilaya: "M'Sila",
        center: 'Magra',
        active: true,
      },
      {
        onSuccess: () => setIsCreateDialogOpen(false),
      }
    );
  };

  const handleSlotClick = (slot: ExamSlot) => {
    setSelectedSlot(slot);
    setIsStudentListOpen(true);
  };

  // Fonction pour afficher les créneaux sur le calendrier
  const getDayContent = (day: Date) => {
    const slotsForDay = (examSlots || []).filter((slot) =>
      isSameDay(new Date(slot.examDate), day)
    );

    if (slotsForDay.length > 0) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <span>{format(day, 'd')}</span>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-1">
              {slotsForDay.slice(0, 3).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
              ))}
            </div>
          </div>
        </div>
      );
    }
    return format(day, 'd');
  };

  // Filtrer créneaux du mois sélectionné
  const filteredSlots = (examSlots || []).filter((slot) => {
    const slotDate = new Date(slot.examDate);
    return (
      slotDate.getMonth() === selectedDate.getMonth() &&
      slotDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Planning des Examens</h1>
          <p className="text-muted-foreground mt-1">
            {filteredSlots.length} créneau{filteredSlots.length > 1 ? 'x' : ''} ce mois
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Créneau
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cr&eacute;er un cr&eacute;neau d&apos;examen</DialogTitle>
            </DialogHeader>
            <ExamSlotDialog onSubmit={handleCreateSlot} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier avec indicateurs */}
        <Card className="p-6 lg:col-span-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={fr}
            className="rounded-md"
            components={{
              DayContent: ({ date }) => getDayContent(date),
            }}
          />
        </Card>

        {/* Liste des créneaux */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Créneaux du {format(selectedDate, 'MMMM yyyy', { locale: fr })}
          </h2>

          {isLoading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : filteredSlots.length > 0 ? (
            <div className="space-y-3">
              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition"
                  onClick={() => handleSlotClick(slot)}
                >
                  <div className="flex-1">
                    <p className="font-semibold">
                      {format(new Date(slot.examDate), 'EEEE dd MMMM yyyy', { locale: fr })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {slot.center}, {slot.wilaya}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{slot.totalStudents || 0} candidat(s)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun créneau trouvé ce mois</p>
          )}
        </Card>
      </div>

      {/* Dialog liste étudiants */}
      <Dialog open={isStudentListOpen} onOpenChange={setIsStudentListOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Candidats - Créneau du{' '}
              {selectedSlot && format(new Date(selectedSlot.examDate), 'dd MMMM yyyy', { locale: fr })}
            </DialogTitle>
          </DialogHeader>
          {selectedSlot && <ExamSlotStudentList examSlot={selectedSlot} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
