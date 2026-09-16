'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { enhance } from '../scripts/client';
export default function ClientEnhancements() {
  const path = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  useEffect(
    () =>
      enhance((url, push = true) => {
        if (push) router.push(url, { scroll: false });
        else router.replace(url, { scroll: false });
      }),
    [path, search, router],
  );
  return null;
}
