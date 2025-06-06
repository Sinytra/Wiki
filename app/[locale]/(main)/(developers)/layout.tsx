import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";

export default async function ProjectLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode;
}>) {
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper-ext mx-1 flex w-full flex-col items-center">
      <div className="w-full max-w-5xl">
        {children}
      </div>
    </div>
  );
}