'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Checkbox } from '@/src/components/ui/checkbox';
import { useRouter, useSearchParams } from '@/src/navigation';
import { LanguageSwitcher } from '@/src/components/LanguageSwitcher';
import { toast } from 'sonner';
import { useAuth } from '@/src/hooks/use-auth';

export default function LoginContent() {
  const translations = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success(translations('loginSuccess') || 'Connexion réussie');
      
      // Rediriger vers la page demandée ou le dashboard par défaut
      const redirect = searchParams.get('redirect') || '/candidats';
      router.push(redirect);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : translations('invalidCredentials') || 'Identifiants invalides';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AE</span>
            </div>
          </div>
          <CardTitle className="text-2xl">{translations('login')}</CardTitle>
          <CardDescription>
            {translations('loginDescription') || translations('loginButton') + ' à votre compte'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {translations('email')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={translations('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {translations('password')}
              </label>
              <Input
                id="password"
                type="password"
                placeholder={translations('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                {translations('rememberMe')}
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? translations('loading') : translations('loginButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
