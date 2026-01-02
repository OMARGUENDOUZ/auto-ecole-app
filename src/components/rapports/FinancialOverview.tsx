'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useTranslations } from 'next-intl';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

interface FinancialOverviewProps {
    data: {
        month: string;
        revenue: number;
        expenses: number;
    }[];
}

export default function FinancialOverview({ data }: FinancialOverviewProps) {
    const t = useTranslations('reports');

    return (
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {t('financialOverview')}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} name={t('totalRevenue')} />
                        <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name={t('totalExpenses')} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
