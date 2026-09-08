import DocsGuideNonContentRightSidebarClient from '@/components/docs/side/guide/DocsGuideNonContentRightSidebarClient';
import ClientLocaleProvider from '@repo/ui/util/ClientLocaleProvider';
import { FileHeading } from '@repo/markdown';

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default async function DocsGuideNonContentRightSidebar({ headings }: ContentRightSidebarProps) {
  return (
    <ClientLocaleProvider keys={['DocsNonContentRightSidebar', 'DocsFloatingNav']}>
      <DocsGuideNonContentRightSidebarClient headings={headings} />
    </ClientLocaleProvider>
  );
}
