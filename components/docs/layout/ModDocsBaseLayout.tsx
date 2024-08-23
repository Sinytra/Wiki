import {ReactNode} from "react";

export default async function ModDocsBaseLayout({leftPanel, children}: Readonly<{
  leftPanel: ReactNode;
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-row gap-4 w-full justify-center">
      <aside className="w-64 flex-shrink-0">
        {leftPanel}
      </aside>
      {children}
    </div>
  );
}