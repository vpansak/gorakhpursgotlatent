'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="py-24 text-center text-slate-400 font-bold">
      Redirecting to Homepage...
    </div>
  );
}
