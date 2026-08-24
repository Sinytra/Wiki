'use client';

import DocsTOCSidebarBase from '@/components/docs/side/DocsTOCSidebarBase';
import { FileHeading } from '@repo/markdown';

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default function DocsGuideNonContentRightSidebarClient({ headings }: ContentRightSidebarProps) {
  return <DocsTOCSidebarBase headings={headings} type="right" className="right-0 w-[96vw] sm:w-64" />;
}
