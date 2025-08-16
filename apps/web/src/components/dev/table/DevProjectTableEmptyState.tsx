import {ReactNode} from "react";
import {useTranslations} from "next-intl";
import {WIKI_DOCS_URL} from "@repo/shared/constants";
import * as React from "react";

interface Props {
  guideLink?: (args: any) => ReactNode;
  children?: ReactNode;
}

export default function DevProjectTableEmptyState({guideLink, children}: Props) {
  const u = useTranslations('EmptyDataTable');
  const args = {
    link: (chunks) => <a className="underline" href={WIKI_DOCS_URL}>{chunks}</a>
  };

  return (
    <div className="my-6 space-y-2 text-secondary">
      {children}

      <p>
        {guideLink ? guideLink(args) : u.rich('guide', args)}
      </p>
    </div>
  )
}