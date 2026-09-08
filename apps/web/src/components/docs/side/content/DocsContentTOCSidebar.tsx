'use client';

import DocsTOCSidebarBase from '@/components/docs/side/DocsTOCSidebarBase';
import { FileHeading } from '@repo/markdown';

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default function DocsContentTOCSidebar({ headings }: ContentRightSidebarProps) {
  return (
    <DocsTOCSidebarBase headings={headings} type="left" className="hidden wide-layout:block wide-layout:w-80" solid />
  );
}
