"use client";

import { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import DocsMobileHeader from "@/components/docs/new/DocsMobileHeader";
import DocsProjectRightSidebar from "@/components/docs/new/DocsProjectRightSidebar";
import DocsContentRightSidebar from "@/components/docs/new/DocsContentRightSidebar";
import DocsLeftSidebar from "@/components/docs/new/DocsLeftSidebar";
import React from "react";

interface DocsLayoutClientProps {
  children: ReactNode;
}

interface HasIsOpen {
  isOpen: boolean;
}

export default function DocsLayoutClient({ children }: DocsLayoutClientProps) {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
  const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);

  console.log(isRightSidebarOpen);

  // Iterate children and add isOpen to the sidebar elements.
  function mapChildrenRecursively(
    children: React.ReactNode
  ): React.ReactNode {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        let clonedChild = child;

        // If the child has its own children, process them first
        const childProps: Record<string, any> = {};
        if (child.props && child.props.children) {
          childProps.children = mapChildrenRecursively(
            child.props.children
          );
        }

        // Now handle the current child if it's one of your sidebars
        if (child.type === DocsLeftSidebar) {
          clonedChild = React.cloneElement(
            child as ReactElement<HasIsOpen>,
            { ...childProps, isOpen: isLeftSidebarOpen }
          );
        } else if (child.type === DocsProjectRightSidebar || child.type === DocsContentRightSidebar) {
          clonedChild = React.cloneElement(
            child as ReactElement<HasIsOpen>,
            { ...childProps, isOpen: isRightSidebarOpen }
          );
        } else if (Object.keys(childProps).length > 0) {
          // If we changed children but not the current element's props
          clonedChild = React.cloneElement(child, childProps);
        }

        return clonedChild;
      }

      return child; // Not a valid element, just return as is
    });
  }

  // Usage in your component
  const modifiedChildren = mapChildrenRecursively(children);


  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Header */}
      <DocsMobileHeader
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleRightSidebar={toggleRightSidebar}
      />
      {modifiedChildren}
    </div>
  );
}