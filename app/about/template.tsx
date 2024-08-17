import {ReactNode} from "react";
import MetaDocsNavigation from "@/components/meta-docs/MetaDocsNavigation";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";

export default function Template({children}: { children: ReactNode }) {
  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <aside className="w-64 flex-shrink-0">
        <DocsSidebarTitle>Navigation</DocsSidebarTitle>

        <MetaDocsNavigation/>
      </aside>
      <div className="prose dark:prose-invert w-full max-w-[67rem]">
        {children}
      </div>
    </div>
  )
}