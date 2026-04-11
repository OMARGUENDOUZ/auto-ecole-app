'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/src/navigation';
import { Button } from '@/src/components/ui/button';
import { LanguageSwitcher } from '@/src/components/LanguageSwitcher';
import { Card, CardContent } from '@/src/components/ui/card';
import { Users, Calendar, BarChart3, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');
  const router = useRouter();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: t('features.candidates'),
      description: t('features.candidatesDesc'),
    },
    {
      icon: <Calendar className="w-8 h-8 text-indigo-600" />,
      title: t('features.planning'),
      description: t('features.planningDesc'),
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: t('features.reports'),
      description: t('features.reportsDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Header / Nav */}
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span>Auto-École Manager</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
          {/* Background Gradients */}
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

          <div className="container text-center">
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {t('welcome')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold transition-all hover:scale-105"
                onClick={() => router.push('/candidats')}
              >
                {t('accessApp')}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                    <div className="mb-6 bg-background p-4 rounded-2xl shadow-sm border">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section Placeholder */}
        <section className="py-20 container text-center">
          <div className="max-w-md mx-auto p-8 rounded-3xl border bg-gradient-to-b from-background to-muted/20">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary mb-4 block">Version Web</span>
            <p className="text-muted-foreground">Acc&eacute;dez &agrave; l&apos;application depuis votre navigateur avec une interface multilingue et un tableau de bord prot&eacute;g&eacute;.</p>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Auto-&Eacute;cole Manager. Tous droits r&eacute;serv&eacute;s.
        </div>
      </footer>
    </div>
  );
}
