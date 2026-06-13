'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
