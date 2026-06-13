'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSignupPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '';
    router.replace(`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
  }, [router]);

  return null;
}
