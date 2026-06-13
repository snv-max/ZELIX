'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '';
    router.replace(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
  }, [router]);

  return null;
}
