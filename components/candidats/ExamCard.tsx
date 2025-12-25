'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle, CalendarCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Exam {
  id: number;
  studentId: number;
  examSlotId?: number;
  category: 'CODE' | 'CONDUITE' | 'PLATEAU' | 'CIRCULATION';
  status: 'PLANNED' | 'SCHEDULED' | 'PASSED' | 'CANCELLED';
  result?: 'PASS' | 'FAIL' | 'PENDING' | null;
  date?: string;
}

interface ExamCardProps {
  exam: Exam;
}

export default function ExamCard({ exam }: ExamCardProps) {
  
  const getStatusDisplay = () => {
    if (exam.status === 'PASSED' && exam.result) {
      switch (exam.result) {
        case 'PASS':
          return {
            icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
            badge: <Badge className="bg-green-600">Admis</Badge>,
            color: 'border-green-200 bg-green-50',
          };
        case 'FAIL':
          return {
            icon: <XCircle className="w-5 h-5 text-red-600" />,
            badge: <Badge className="bg-red-600">Échoué</Badge>,
            color: 'border-red-200 bg-red-50',
          };
        case 'PENDING':
          return {
            icon: <Clock className="w-5 h-5 text-yellow-600" />,
            badge: <Badge className="bg-yellow-600">Résultat en attente</Badge>,
            color: 'border-yellow-200 bg-yellow-50',
          };
      }
    }

    switch (exam.status) {
      case 'SCHEDULED':
        return {
          icon: <CalendarCheck className="w-5 h-5 text-purple-600" />,
          badge: <Badge className="bg-purple-600">Programmé</Badge>,
          color: 'border-purple-200',
        };
      case 'PLANNED':
        return {
          icon: <Clock className="w-5 h-5 text-blue-600" />,
          badge: <Badge className="bg-blue-600">Planifié</Badge>,
          color: 'border-blue-200',
        };
      case 'CANCELLED':
        return {
          icon: <XCircle className="w-5 h-5 text-gray-600" />,
          badge: <Badge variant="outline">Annulé</Badge>,
          color: 'border-gray-200',
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
          badge: <Badge variant="outline">Non planifié</Badge>,
          color: 'border-gray-200',
        };
    }
  };

  const getCategoryLabel = () => {
    switch (exam.category) {
      case 'CODE':
        return 'Code de la route';
      case 'CONDUITE':
        return 'Conduite pratique';
      case 'PLATEAU':
        return 'Épreuve plateau';
      case 'CIRCULATION':
        return 'Circulation';
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

        {/* Afficher le statut si examen passé */}
        {exam.status === 'PASSED' && (
          <div className="mt-3 pt-3 border-t">
          </div>
        )}

        {/* Message si planifié ou programmé */}
        {(exam.status === 'PLANNED' || exam.status === 'SCHEDULED') && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              {exam.status === 'PLANNED' 
                ? "L'examen sera programmé prochainement"
                : "Examen inscrit et confirmé"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
