import { Suspense } from 'react';
import LoginContent from '@/src/components/auth/LoginContent';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
