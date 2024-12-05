import {ReactNode} from "react";

export default async function ProjectDocsEntryPageLayout({rightPanel, mobileToolbar, children}: Readonly<{
  rightPanel: ReactNode;
  mobileToolbar?: ReactNode;
  children: ReactNode;
}>) {
  return <>
    {mobileToolbar &&
      <div className="md:hidden">
        {mobileToolbar}
      </div>
    }
    <div className="w-full max-w-[50rem] px-2 md:px-0">
      {children}
    </div>
    <aside className="w-64 flex-shrink-0 hidden lg:block sm:sticky sm:top-20 sm:h-[calc(100vh_-_8rem)]">
      {rightPanel}
    </aside>
  </>
}