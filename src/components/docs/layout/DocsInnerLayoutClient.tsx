import DocsGuideFileTreeSidebar from "@/components/docs/side/guide/DocsGuideFileTreeSidebar";
import {FileTree, Project} from "@repo/shared/types/service";
import DocsResponsiveHeader from "@/components/docs/layout/DocsResponsiveHeader";

interface Props {
  title: string;
  project: Project;
  version: string;
  locale: string;
  tree: FileTree;
  showRightSidebar?: boolean;
  children: any;

  rightSidebar?: any;
  footer: any;
}

export default function DocsInnerLayoutClient({title, project, version, rightSidebar, footer, tree, showRightSidebar, children}: Props) {
  return <>
    <DocsResponsiveHeader showRightSidebar={showRightSidebar}>
      {title}
    </DocsResponsiveHeader>

    {/* Main Content Area */}
    <div className="flex w-full max-w-[1632px] flex-1 flex-row justify-between gap-4">
      {/* Left Sidebar */}
      <DocsGuideFileTreeSidebar slug={project.id} version={version} tree={tree}/>

      {/* Main Content */}
      <main className={`
        mt-4 min-h-[86vh] flex-1 overflow-auto px-2 pb-6 sm:mt-0 sm:min-h-[auto] sm:max-w-5xl sm:pt-4 lg:px-0 lg:pt-2
      `}>
        {children}
      </main>

      {/* Right Sidebar */}
      {rightSidebar}
    </div>

    {/* Footer */}
    {footer}
  </>
}