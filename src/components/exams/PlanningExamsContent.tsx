'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Plus, Users, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { fr, arDZ } from 'date-fns/locale';
import { useExamSlots, useCreateExamSlot } from '@/src/hooks/use-exam-slots';
import { ExamSlot } from '@/src/types/exam';
import ExamSlotDialog from './ExamSlotDialog';
import ExamSlotStudentList from './ExamSlotStudentList';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function PlanningExamsContent() {
  const t = useTranslations('exams');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<ExamSlot | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isStudentListOpen, setIsStudentListOpen] = useState(false);

  const params = useParams();
  const locale = (params?.locale as string) ?? 'fr';
  const dateLocale = locale === 'ar' ? arDZ : fr;

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

  const handlePrevMonth = () => {
    setSelectedDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => addMonths(prev, 1));
  };

  const handleCurrentMonth = () => {
    setSelectedDate(new Date());
  }

  // Filtrer créneaux du mois sélectionné (redondant si l'API filtre déjà, mais sécurité)
  const filteredSlots = (examSlots || []).filter((slot) => {
    const slotDate = new Date(slot.examDate);
    return (
      slotDate.getMonth() === selectedDate.getMonth() &&
      slotDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-sm">
              <Plus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
              {t('newSlot')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createSlot')}</DialogTitle>
            </DialogHeader>
            <ExamSlotDialog onSubmit={handleCreateSlot} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Month Navigation */}
      <Card className="p-2 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-muted/60 shadow-sm">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
        </Button>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 px-4 py-2 rounded-md transition-colors" onClick={handleCurrentMonth}>
          <CalendarIcon className="w-5 h-5 text-primary" />
          <span className="text-lg font-semibold capitalize min-w-[150px] text-center">
            {format(selectedDate, 'MMMM yyyy', { locale: dateLocale })}
          </span>
        </div>

        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5 rtl:rotate-180" />
        </Button>
      </Card>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">{t('loadingSlots')}</p>
          </div>
        ) : filteredSlots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlots.map((slot) => {
              const slotDate = new Date(slot.examDate);
              return (
                <Card
                  key={slot.id}
                  className="group relative overflow-hidden hover:shadow-lg transition-all cursor-pointer border-muted/60 bg-gradient-to-br from-card to-accent/5"
                  onClick={() => handleSlotClick(slot)}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary group-hover:w-3 transition-all duration-300" />

                  <div className="p-6 pl-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary uppercase tracking-wide">
                          {format(slotDate, 'EEEE', { locale: dateLocale })}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-4xl font-bold tracking-tighter text-foreground">
                            {format(slotDate, 'dd', { locale: dateLocale })}
                          </h3>
                          <span className="text-xl text-muted-foreground font-medium capitalize">
                            {format(slotDate, 'MMMM', { locale: dateLocale })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium opacity-80">
                          {format(slotDate, 'yyyy', { locale: dateLocale })}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                      <div className="p-2 rounded-full bg-secondary/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{t('examCenterHeader')}</span>
                        <span className="font-medium text-lg">{slot.center}, {slot.wilaya}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <div className="bg-muted rounded-full p-6 mb-4">
              <CalendarIcon className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">{t('noExamsThisMonth')}</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              {t('noExamsScheduledFor', { month: format(selectedDate, 'MMMM yyyy', { locale: dateLocale }) })}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('scheduleSession')}
            </Button>
          </div>
        )}
      </div>

      {/* Dialog liste étudiants */}
      <Dialog open={isStudentListOpen} onOpenChange={setIsStudentListOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t('candidatesSlot')}{' '}
              {selectedSlot && format(new Date(selectedSlot.examDate), 'dd MMMM yyyy', { locale: dateLocale })}
            </DialogTitle>
          </DialogHeader>
          {selectedSlot && <ExamSlotStudentList examSlot={selectedSlot} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
