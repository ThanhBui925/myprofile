'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

function CourseRedirectContent() {
  const router = useRouter();
  const { slug } = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.replace(`/documents/${slug}${query ? `?${query}` : ''}`);
  }, [router, slug, searchParams]);

  return null;
}

export default function CourseSlugRedirect() {
  return (
    <Suspense fallback={null}>
      <CourseRedirectContent />
    </Suspense>
  );
}
