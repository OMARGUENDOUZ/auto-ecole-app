'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Calendar } from '@/src/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr, arDZ } from 'date-fns/locale';
import { cn } from '@/src/lib/utils';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface ExamSlotDialogProps {
  onSubmit: (date: Date) => void;
}

export default function ExamSlotDialog({ onSubmit }: ExamSlotDialogProps) {
  const t = useTranslations('exams');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'fr';
  const dateLocale = locale === 'ar' ? arDZ : fr;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="space-y-4">
      <div>
        <Label>{t('examDate')}</Label>
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
                format(selectedDate, 'dd MMMM yyyy', { locale: dateLocale })
              ) : (
                <span>{t('chooseDate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={dateLocale}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>{t('wilaya')}</Label>
        <Input value="M'Sila" disabled className="bg-muted mt-2" />
      </div>

      <div>
        <Label>{t('center')}</Label>
        <Input value="Magra" disabled className="bg-muted mt-2" />
      </div>

      <Button onClick={() => onSubmit(selectedDate)} className="w-full">
        {t('createButton')}
      </Button>
    </div>
  );
}
