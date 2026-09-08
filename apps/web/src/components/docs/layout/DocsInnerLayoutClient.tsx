import DocsGuideFileTreeSidebar from '@/components/docs/side/guide/DocsGuideFileTreeSidebar';
import { FileTree } from '@repo/shared/types/service';
import { ProjectData } from '@sinytra/wiki-api-types';
import { cn } from '@repo/ui/lib/utils';
import DocsGuideFloatingNav from '@/components/docs/layout/DocsGuideFloatingNav';

interface Props {
  title: string;
  project: ProjectData;
  version: string;
  locale: string;
  tree: FileTree;
  children: any;

  rightSidebar?: any;
  footer: any;
}

export default function DocsInnerLayoutClient({ project, version, rightSidebar, footer, tree, children }: Props) {
  return (
    <>
      {/* Main Content Area */}
      <div className="flex w-full max-w-[1632px] flex-1 flex-row justify-center wide-layout:justify-between">
        {/* Left Sidebar */}
        <DocsGuideFileTreeSidebar slug={project.id} version={version} tree={tree} />

        {/* Main Content */}
        <main
          className={cn(
            'mx-4 mt-4 min-h-[86vh] flex-1 overflow-auto pb-6 lg:mx-6',
            'sm:mt-0 sm:min-h-auto sm:max-w-5xl sm:pt-4'
          )}
        >
          {children}
        </main>

        {/* Right Sidebar */}
        {rightSidebar}
      </div>

      {/* Footer */}
      {footer}

      <DocsGuideFloatingNav />
    </>
  );
}
