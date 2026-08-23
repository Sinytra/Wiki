'use client';

import { useEffect } from 'react';
import DocsPageNotFound from '@/components/docs/error/DocsPageNotFound';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => console.error(error), [error]);

  return <DocsPageNotFound />;
}
