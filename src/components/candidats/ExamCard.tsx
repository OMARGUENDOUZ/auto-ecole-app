'use client';

import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';
import { useTranslations } from 'next-intl';
import { Exam, ExamStatus, ExamResult, ExamCategory } from '@/src/types/exam';

interface ExamCardProps {
  exam: Exam;
}

export default function ExamCard({ exam }: ExamCardProps) {
  const t = useTranslations('exams');

  const getStatusDisplay = () => {
    if (exam.status === ExamStatus.PASSED && exam.result) {
      switch (exam.result) {
        case ExamResult.PASS:
          return {
            icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
            badge: <Badge className="bg-green-600">{t('passed')}</Badge>,
            color: 'border-green-200 bg-green-50',
          };
        case ExamResult.FAIL:
          return {
            icon: <XCircle className="w-5 h-5 text-red-600" />,
            badge: <Badge className="bg-red-600">{t('failed')}</Badge>,
            color: 'border-red-200 bg-red-50',
          };
        case ExamResult.PENDING:
          return {
            icon: <Clock className="w-5 h-5 text-yellow-600" />,
            badge: <Badge className="bg-yellow-600">{t('pending')}</Badge>,
            color: 'border-yellow-200 bg-yellow-50',
          };
      }
    }

    switch (exam.status) {
      case ExamStatus.PLANNED:
        return {
          icon: <Clock className="w-5 h-5 text-blue-600" />,
          badge: <Badge className="bg-blue-600">{t('planned')}</Badge>,
          color: 'border-blue-200',
        };
      case ExamStatus.CANCELLED:
        return {
          icon: <XCircle className="w-5 h-5 text-gray-600" />,
          badge: <Badge variant="outline">{t('cancelled')}</Badge>,
          color: 'border-gray-200',
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
          badge: <Badge variant="outline">{t('not_planned')}</Badge>,
          color: 'border-gray-200',
        };
    }
  };

  const getCategoryLabel = () => {
    switch (exam.category) {
      case ExamCategory.CODE:
        return 'Code de la route';
      case ExamCategory.CONDUITE:
        return 'Conduite pratique';
      case ExamCategory.CRENEAU:
        return 'Épreuve plateau / Créneau';
      default:
        return exam.category;
    }
  };

  const display = getStatusDisplay();

  return (
    <Card className={`hover:shadow-lg transition-shadow border-2 ${display.color}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {display.icon}
            <h3 className="font-semibold">{getCategoryLabel()}</h3>
          </div>
          {display.badge}
        </div>

        {/* Date de l'examen */}
        {exam.date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(exam.date)}</span>
          </div>
        )}

        {/* Message si planifié */}
        {exam.status === ExamStatus.PLANNED && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              L examen sera programmé prochainement
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
