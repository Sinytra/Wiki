import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";

export default async function ModLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode;
}>) {
  setContextLocale(params.locale);

  return (
    <div className="flex flex-col w-full items-center mx-1 sm:mx-6">
      <div className="max-w-5xl w-full">
        {children}
      </div>
    </div>
  );
}