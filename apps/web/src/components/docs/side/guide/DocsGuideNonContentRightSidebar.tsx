import {FileHeading} from "@repo/shared/types/metadata";
import DocsGuideNonContentRightSidebarClient from "@/components/docs/side/guide/DocsGuideNonContentRightSidebarClient";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default async function DocsGuideNonContentRightSidebar({ headings }: ContentRightSidebarProps) {
  return (
    <ClientLocaleProvider keys={['DocsNonContentRightSidebar']}>
      <DocsGuideNonContentRightSidebarClient headings={headings}/>
    </ClientLocaleProvider>
  )
}