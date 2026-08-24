import * as React from 'react';
import ReportPageButton from '@/components/docs/layout/ReportPageButton';
import EditPageButton from '@/components/docs/layout/EditPageButton';
import env from '@repo/shared/env';
import { cn } from '@repo/ui/lib/utils';

interface Props {
  project: string;
  id: string;
  editUrl?: string | null;
  local?: boolean;
  className?: string;
}

export default function DocsContentPageToolsFooter({ project, id, local, editUrl, className }: Props) {
  return (
    <footer
      className={cn(
        className,
        'relative flex w-full shrink-0 flex-col justify-between gap-y-3 bg-primary px-1 pt-4 text-sm text-secondary'
      )}
    >
      <hr className="mb-1" />

      <div className="flex flex-col gap-3">
        <div className="flex flex-row flex-wrap justify-between gap-2">
          <ReportPageButton full local={local} type="content" project={project} path={[id]} preview={env.isPreview()} />
          <EditPageButton editUrl={editUrl} />
        </div>
      </div>
    </footer>
  );
}
