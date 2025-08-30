import * as React from "react";
import ReportPageButton from "@/components/docs/layout/ReportPageButton";
import EditPageButton from "@/components/docs/layout/EditPageButton";
import env from "@repo/shared/env";

interface Props {
  project: string;
  id: string;
  editUrl?: string;
  local?: boolean;
}

export default function DocsContentPageToolsFooter({project, id, local, editUrl}: Props) {
  return (
    <footer className={`
      relative flex w-full shrink-0 flex-col-reverse justify-between gap-y-3 border-t border-border bg-primary px-1 pt-4
      text-sm text-secondary sm:hidden
    `}>
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex flex-row flex-wrap justify-between gap-2">
          <ReportPageButton local={local} project={project} path={[id]} preview={env.isPreview()}/>
          <EditPageButton editUrl={editUrl}/>
        </div>
      </div>
    </footer>
  )
}