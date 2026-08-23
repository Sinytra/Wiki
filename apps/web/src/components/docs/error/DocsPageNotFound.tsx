'use client';

import { useParams } from 'next/navigation';
import { ProjectRouteParams } from '@repo/shared/types/routes';
import DocsPageNotFoundBase from './DocsPageNotFoundBase';

interface Props {
  returnSuffix?: string;
}

export default function DocsPageNotFound({ returnSuffix }: Props) {
  const params = useParams() as unknown as ProjectRouteParams;

  return (
    <DocsPageNotFoundBase
      returnTo={`/${params.locale}/project/${params.slug}/${params.version}${returnSuffix ?? ''}`}
    ></DocsPageNotFoundBase>
  );
}
