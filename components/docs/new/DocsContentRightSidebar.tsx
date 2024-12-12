import DocsSidebarBase from "@/components/docs/new/DocsSidebarBase";

interface ContentRightSidebarProps {
  isOpen: boolean;
}

export default function DocsContentRightSidebar({isOpen}: ContentRightSidebarProps) {
  return (
    <DocsSidebarBase title="Content details" className={`
      ${isOpen ? '' : 'translate-x-full'}
      ${isOpen ? 'w-64' : 'w-0 lg:w-64'}`}
    >
      Hello {/*TODO*/}
    </DocsSidebarBase>
  );
}
