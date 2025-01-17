import { ReactNode } from "react";
import { setContextLocale } from "@/lib/locales/routing";

export default function LocaleLayout({ params, children }: Readonly<{
  params: { locale: string };
  children: ReactNode;
}>) {
  setContextLocale(params.locale);

  return (
    <div className="flex flex-col min-h-screen mx-4 page-wrapper-base sm:mx-2">
      <div className="flex flex-col w-full items-center mx-1">
        {children}
      </div>
    </div>
  );
}
