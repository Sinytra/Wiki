'use client';

import { useParams } from 'next/navigation';
import { ProjectRouteParams } from '@repo/shared/types/routes';
import DocsPageErrorBase from './DocsPageErrorBase';

export interface Props {
  returnSuffix?: string;
}

export default function DocsPageError({ returnSuffix }: Props) {
  const params = useParams() as unknown as ProjectRouteParams;

  return (
    <DocsPageErrorBase
      returnTo={`/${params.locale}/project/${params.slug}/${params.version}${returnSuffix ?? ''}`}
    ></DocsPageErrorBase>
  );
}
