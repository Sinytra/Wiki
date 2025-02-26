import DocsGuideFileTreeSidebar from "@/components/docs/side/guide/DocsGuideFileTreeSidebar";
import {FileTree, Project} from "@/lib/service";

interface Props {
  project: Project;
  version: string;
  locale: string;
  tree: FileTree;
  children: any;

  rightSidebar?: any;
  footer: any;
}

export default function DocsInnerLayoutClient({project, version, rightSidebar, footer, tree, children}: Props) {
  return <>
    {/* Main Content Area */}
    <div className="flex flex-row flex-1 justify-center gap-12">
      {/* Left Sidebar */}
      <DocsGuideFileTreeSidebar slug={project.id} version={version} tree={tree}/>

      {/* Main Content */}
      <main className="flex-1 pb-6 pt-2 overflow-auto min-h-[86vh] sm:min-h-[auto] sm:max-w-5xl">
        {children}
      </main>

      {/* Right Sidebar */}
      {rightSidebar}
    </div>

    {/* Footer */}
    {footer}
  </>
}