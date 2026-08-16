'use client';

import { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function CourseSlugRedirect() {
  const router = useRouter();
  const { slug } = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.replace(`/documents/${slug}${query ? `?${query}` : ''}`);
  }, [router, slug, searchParams]);

  return null;
}
