"use client";

import {ReactNode, useState} from "react";
import DocsMobileHeader from "@/components/docs/new/DocsMobileHeader";

interface DocsLayoutClientProps {
  children: ReactNode;
}

export default function DocsLayoutClient({children}: DocsLayoutClientProps) {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Header */}
      <DocsMobileHeader
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleRightSidebar={toggleRightSidebar}
      />

      {children}
    </div>
  );
}