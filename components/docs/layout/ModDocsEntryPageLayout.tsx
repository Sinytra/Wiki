import {ReactNode} from "react";

export default async function ModDocsEntryPageLayout({rightPanel, children}: Readonly<{
  rightPanel: ReactNode;
  children: ReactNode;
}>) {
  return <>
    <div className="w-full max-w-[50rem]">
      {children}
    </div>
    <aside className="w-64 flex-shrink-0">
      {rightPanel}
    </aside>
  </>
}