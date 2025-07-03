import {ReactNode, use} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import MetaDevDocsNavigation from "@/components/meta-docs/MetaDevDocsNavigation";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

export const dynamic = 'force-static';

type Params = Promise<{ locale: string }>;

export default function AboutLayout(props: { params: Params; children: ReactNode; }) {
  const params = use(props.params);
  const {children} = props;
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper-ext flex w-full flex-col gap-4 md:flex-row md:justify-center">
      <aside className="mb-2 w-full shrink-0 rounded-md bg-primary-alt px-2 md:mb-0 md:w-64">
        <ClientLocaleProvider keys={['MetaDevDocsNavigation']}>
          <MetaDevDocsNavigation/>
        </ClientLocaleProvider>
      </aside>
      <div className={`
        prose w-full max-w-[67rem] px-2 md:px-0 dark:prose-invert prose-h2:border-b prose-h2:border-b-neutral-700
        prose-h2:pb-1
      `}>
        {children}
      </div>
    </div>
  )
}