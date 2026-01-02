'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import FinancialOverview from '@/src/components/rapports/FinancialOverview';
import PerformanceStats from '@/src/components/rapports/PerformanceStats';
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Calendar,
} from 'lucide-react';

const MOCK_FINANCIAL_DATA = [
  { month: 'Jan', revenue: 450000, expenses: 320000 },
  { month: 'Feb', revenue: 520000, expenses: 340000 },
  { month: 'Mar', revenue: 480000, expenses: 310000 },
  { month: 'Apr', revenue: 610000, expenses: 380000 },
  { month: 'May', revenue: 550000, expenses: 350000 },
  { month: 'Jun', revenue: 670000, expenses: 400000 },
];

const MOCK_SUCCESS_DATA = [
  { name: 'Catégorie B', value: 75 },
  { name: 'Catégorie A', value: 88 },
  { name: 'Catégorie C', value: 62 },
  { name: 'Catégorie D', value: 45 },
];

const MOCK_INSTRUCTOR_DATA = [
  { name: 'Ahmed', value: 82 },
  { name: 'Fatima', value: 91 },
  { name: 'Mohamed', value: 78 },
];

export default function RapportsPage() {
  const t = useTranslations('reports');

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-premium bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">{t('totalRevenue')}</p>
              <h3 className="text-2xl font-bold">3,280,000 DA</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-premium bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-emerald-100 text-sm font-medium">{t('successRate')}</p>
              <h3 className="text-2xl font-bold">78%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-premium bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-orange-100 text-sm font-medium">{t('monthlyRegistrations')}</p>
              <h3 className="text-2xl font-bold">+42</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-premium bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-purple-100 text-sm font-medium">{t('netBalance')}</p>
              <h3 className="text-2xl font-bold">1,180,000 DA</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialOverview data={MOCK_FINANCIAL_DATA} />
        <div className="grid grid-cols-1 gap-6">
          <PerformanceStats
            data={MOCK_SUCCESS_DATA}
            title={`${t('examSuccess')} - ${t('byCategory')}`}
          />
          <PerformanceStats
            data={MOCK_INSTRUCTOR_DATA}
            title={`${t('examSuccess')} - ${t('byInstructor')}`}
          />
        </div>
      </div>
    </div>
  );
}
