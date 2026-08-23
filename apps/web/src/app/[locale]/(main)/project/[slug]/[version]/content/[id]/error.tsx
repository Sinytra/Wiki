'use client';

import { useEffect } from 'react';
import DocsPageError from '@/components/docs/error/DocsPageError';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => console.error(error), [error]);

  return <DocsPageError returnSuffix="/content" />;
}
