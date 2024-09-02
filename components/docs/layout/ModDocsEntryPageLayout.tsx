import {ReactNode} from "react";

export default async function ModDocsEntryPageLayout({rightPanel, children}: Readonly<{
  rightPanel: ReactNode;
  children: ReactNode;
}>) {
  return <>
    <div className="w-full max-w-[50rem] px-2 md:px-0">
      {children}
    </div>
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      {rightPanel}
    </aside>
  </>
}