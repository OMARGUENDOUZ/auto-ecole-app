'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RapportsPage() {
  const t = useTranslations('navigation');
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('rapports')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Page en construction...</p>
        </CardContent>
      </Card>
    </div>
  );
}
