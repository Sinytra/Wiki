import DocsLeftSidebar from "@/components/docs/new/DocsLeftSidebar";
import { FileTree, Project } from "@/lib/service";

interface Props {
  project: Project;
  version: string;
  locale: string;
  tree: FileTree;
  children: any;

  rightSidebar: any;
  footer: any;
}

export default function DocsInnerLayoutClient({ project, version, rightSidebar, footer, tree, children }: Props) {
  return <>
    {/* Main Content Area */}
    <div className="flex flex-1">
      {/* Left Sidebar */}
      <DocsLeftSidebar slug={project.id} version={version} tree={tree} isOpen />

      {/* Main Content TODO changelog */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>

      {/* Right Sidebar */}
      {rightSidebar}
    </div>

    {/* Footer */}
    {footer}
  </>
}