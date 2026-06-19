'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { setSession } = useAuthStore();
  const [message, setMessage] = useState('Google 계정 확인 중...');

  useEffect(() => {
    let mounted = true;

    const completeLogin = async () => {
      try {
        const res = await fetch('/api/auth/google/complete', { cache: 'no-store' });
        const json = await res.json();

        if (!mounted) return;

        if (!res.ok) {
          setMessage(json.error || '로그인 처리에 실패했습니다.');
          setTimeout(() => router.replace('/login'), 1200);
          return;
        }

        if (json.data.status === 'needs_company') {
          router.replace('/onboarding/company');
          return;
        }

        setSession(json.data.user, json.data.company);
        router.replace('/dashboard');
      } catch {
        if (!mounted) return;
        setMessage('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => router.replace('/login'), 1200);
      }
    };

    completeLogin();

    return () => {
      mounted = false;
    };
  }, [router, setSession]);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <div className="text-5xl mb-4">🌶️</div>
        <Loader2 className="w-7 h-7 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
