'use client';

import DocsTOCSidebarBase from '@/components/docs/side/DocsTOCSidebarBase';
import { FileHeading } from '@repo/markdown';

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default function DocsGuideNonContentRightSidebarClient({ headings }: ContentRightSidebarProps) {
  return <DocsTOCSidebarBase type="right" headings={headings} />;
}
