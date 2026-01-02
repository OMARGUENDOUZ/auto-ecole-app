'use client';

import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import { Calendar, FileText, Building2, CalendarClock, Award } from 'lucide-react';
import { formatDate } from '@/src/lib/utils';
import { License } from '@/src/types/candidat';
import { useTranslations } from 'next-intl';

interface LicenseCardProps {
  license: License;
  translations: ReturnType<typeof useTranslations>;
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Award;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

export default function LicenseCard({
  license,
  translations,
}: LicenseCardProps) {
  const tLicense = useTranslations('license');

  // Déterminer si le permis est expiré
  const isExpired = new Date(license.expirationDate) < new Date();
  const isExpiringSoon =
    new Date(license.expirationDate) <
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 jours

  return (
    <Card
      className={`border-l-4 ${
        isExpired
          ? 'border-l-destructive'
          : isExpiringSoon
          ? 'border-l-yellow-500'
          : 'border-l-green-500'
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                {translations('licenseCategory')} {license.licenseCategory}
              </h4>
              <p className="text-sm text-muted-foreground">
                {translations('licenseNumber')}: {license.licenseNumber}
              </p>
            </div>
          </div>
          {isExpired ? (
            <Badge variant="destructive">{translations('expired')}</Badge>
          ) : isExpiringSoon ? (
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-600"
            >
              {translations('expiringSoon')}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-green-500 text-green-600">
              {translations('valid')}
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={Calendar}
            label={translations('obtentionDate')}
            value={formatDate(license.obtentionDate)}
          />
          <InfoItem
            icon={FileText}
            label={translations('issueDate')}
            value={formatDate(license.issueDate)}
          />
          <InfoItem
            icon={Building2}
            label={translations('issuingAuthority')}
            value={license.issuingAuthority}
          />
          <InfoItem
            icon={CalendarClock}
            label={translations('expirationDate')}
            value={formatDate(license.expirationDate)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
