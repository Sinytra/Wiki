// /components/docs/new/DocsLayoutClient.tsx

"use client"; // Mark as Client Component

import { ReactElement, ReactNode } from "react";
import { useState } from "react";
import DocsMobileHeader from "@/components/docs/new/DocsMobileHeader";
import DocsChangelogPage from "@/components/docs/new/DocsChangelogPage";
import DocsLeftSidebar from "@/components/docs/new/DocsLeftSidebar";
import DocsPageFooter from "@/components/docs/new/DocsPageFooter";
import DocsRightSidebar from "@/components/docs/new/DocsRightSidebar";
import DocsMarkdownContent from "@/components/docs/new/DocsMarkdownContent";
import DocsHomepagePlaceholder from "@/components/docs/DocsHomepagePlaceholder";
import { PlatformProject } from "@/lib/platforms";
import { Project } from "@/lib/service";

interface DocsLayoutClientProps {
    project: Project;
    platformProject: PlatformProject;
    version: string;
    locale: string;
    homepageContent: ReactElement | null;
    children: ReactNode;
}

export default function DocsLayoutClient({
    project,
    platformProject,
    version,
    locale,
    homepageContent,
    children,
}: DocsLayoutClientProps) {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [isChangelogOpen, setIsChangelogOpen] = useState(false);

    const toggleLeftSidebar = () => setIsLeftSidebarOpen(!isLeftSidebarOpen);
    const toggleRightSidebar = () => setIsRightSidebarOpen(!isRightSidebarOpen);
    const toggleChangelog = () => setIsChangelogOpen(!isChangelogOpen);

    const changelogEntries = [
        { version: "1.2.0", date: "2023-12-01", changes: ["Added new feature X", "Fixed bug Y", "Improved performance of Z"] },
        { version: "1.1.0", date: "2023-11-15", changes: ["Introduced feature A", "Updated dependency B", "Removed deprecated function C"] },
        { version: "1.0.0", date: "2023-11-01", changes: ["Initial release"] },
    ];

    return (
        <div className="flex flex-col flex-1 bg-background text-foreground">
            {/* Header */}
            <DocsMobileHeader
                isLeftSidebarOpen={isLeftSidebarOpen}
                isRightSidebarOpen={isRightSidebarOpen}
                toggleLeftSidebar={toggleLeftSidebar}
                toggleRightSidebar={toggleRightSidebar}
            />

            {/* Main Content Area */}
            <div className="flex flex-1">
                {/* Left Sidebar */}
                <DocsLeftSidebar isOpen={isLeftSidebarOpen} toggleSidebar={toggleLeftSidebar} />

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {isChangelogOpen ? (
                        <DocsChangelogPage entries={changelogEntries} />
                    ) : homepageContent ? (
                            <DocsMarkdownContent>{homepageContent}</DocsMarkdownContent>
                        ) : platformProject.is_placeholder ? (
                            <DocsHomepagePlaceholder />
                        ) : (
                            <DocsMarkdownContent>{children}</DocsMarkdownContent>
                        )
                    }
                </main>

                {/* Right Sidebar */}
                <DocsRightSidebar isOpen={isRightSidebarOpen} toggleSidebar={toggleRightSidebar} />
            </div>

            {/* Footer */}
            <DocsPageFooter isChangelogOpen={isChangelogOpen} toggleChangelog={toggleChangelog} />
        </div>
    );
}