import { notFound } from 'next/navigation';
import { routing } from '@/src/routing';
import { Header } from '@/src/components/layout/Header';
import { Sidebar } from '@/src/components/layout/Sidebar';

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
