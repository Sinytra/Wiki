import {ReactNode} from "react";

export default async function ModDocsLayout({leftPanel, rightPanel, children}: Readonly<{
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <aside className="w-64 flex-shrink-0">
        {leftPanel}
      </aside>
      <div className="w-full max-w-[50rem]">
        {children}
      </div>
      <aside className="w-64 flex-shrink-0">
        {rightPanel}
      </aside>
    </div>
  );
}