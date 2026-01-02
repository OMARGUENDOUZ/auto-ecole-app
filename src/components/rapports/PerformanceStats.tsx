'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useTranslations } from 'next-intl';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';

interface PerformanceStatsProps {
    data: {
        name: string;
        value: number;
    }[];
    title: string;
}

const COLORS = ['#3b82f6', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

export default function PerformanceStats({ data, title }: PerformanceStatsProps) {
    return (
        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
