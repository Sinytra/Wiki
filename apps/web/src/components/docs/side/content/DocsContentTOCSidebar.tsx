'use client';

import DocsTOCSidebarBase from '@/components/docs/side/DocsTOCSidebarBase';
import { FileHeading } from '@repo/markdown';

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default function DocsContentTOCSidebar({ headings }: ContentRightSidebarProps) {
  return (
    <DocsTOCSidebarBase headings={headings} type="left" className="left-0 hidden w-[96vw] sm:w-80 2xl:block" solid />
  );
}
