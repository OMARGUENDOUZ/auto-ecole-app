'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ExamSlotDialogProps {
  onSubmit: (date: Date) => void;
}

export default function ExamSlotDialog({ onSubmit }: ExamSlotDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="space-y-4">
      <div>
        <Label>Date de l&apos;examen</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal mt-2',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, 'dd MMMM yyyy', { locale: fr })
              ) : (
                <span>Choisir une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={fr}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Wilaya</Label>
        <Input value="M&apos;Sila" disabled className="bg-muted mt-2" />
      </div>

      <div>
        <Label>Centre</Label>
        <Input value="Magra" disabled className="bg-muted mt-2" />
      </div>

      <Button onClick={() => onSubmit(selectedDate)} className="w-full">
        Créer le créneau
      </Button>
    </div>
  );
}
