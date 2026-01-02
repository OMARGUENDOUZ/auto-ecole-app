'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Award, FileText, CreditCard, Edit2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { License, Student } from '@/src/types/candidat';
import { Exam } from '@/src/types/exam';
import LicenseCard from './LicenseCard';
import ExamCard from './ExamCard';

interface CandidatTabsProps {
  candidat: Student;
  exams?: Exam[];
  onAddLicense?: () => void;
}

export default function CandidatTabs({
  candidat,
  exams = [],
  onAddLicense,
}: CandidatTabsProps) {
  const t = useTranslations('candidats');
  const [activeTab, setActiveTab] = useState<'licenses' | 'exams' | 'payments'>(
    'licenses'
  );

  const tabButtons = [
    {
      id: 'licenses' as const,
      label: t('ownedLicenses'),
      icon: Award,
      count: candidat.ownedLicense?.length || 0,
    },
    {
      id: 'exams' as const,
      label: t('exams'),
      icon: FileText,
      count: exams.length,
    },
    {
      id: 'payments' as const,
      label: t('payments'),
      icon: CreditCard,
      count: 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-2 border-b -mx-6 px-6">
          {tabButtons.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* TAB: LICENSES */}
        {activeTab === 'licenses' && (
          <div className="space-y-4">
            {candidat.ownedLicense && candidat.ownedLicense.length > 0 ? (
              <div className="space-y-4">
                {candidat.ownedLicense.map((license, index: number) => (
                  <LicenseCard key={index} license={license} translations={t} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium mb-1">{t('noOwnedLicenses')}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {t('noOwnedLicensesDetailDescription')}
                </p>
                {onAddLicense && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddLicense}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    {t('addLicense')}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: EXAMS */}
        {activeTab === 'exams' && (
          <div className="space-y-4">
            {exams.length > 0 ? (
              <div className="space-y-3">
                {exams.map((exam: Exam, index: number) => (
                  <ExamCard key={exam.id || index} exam={exam} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium mb-1">{t('noExams')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('scheduleExam')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium mb-1">{t('payments')}</p>
            <p className="text-xs text-muted-foreground">
              {t('paymentsSectionComingSoon')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
