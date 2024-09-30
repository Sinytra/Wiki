import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";

export default function LocaleLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode;
}>) {
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper flex flex-1 min-h-[100vh] mx-4 sm:mx-2">
      {children}
    </div>
  )
}
