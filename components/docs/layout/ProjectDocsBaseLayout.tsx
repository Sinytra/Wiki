import {ReactNode} from "react";

export default async function ProjectDocsBaseLayout({leftPanel, children}: Readonly<{
  leftPanel: ReactNode;
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
      <aside className="bg-muted rounded-md w-full md:w-64 md:mb-0 flex-shrink-0 md:sticky md:top-20 md:h-[calc(100vh_-_8rem)]">
        {leftPanel}
      </aside>
      {children}
    </div>
  );
}