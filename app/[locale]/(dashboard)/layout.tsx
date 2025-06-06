import { ReactNode } from "react";
import { setContextLocale } from "@/lib/locales/routing";

export default function LocaleLayout({ params, children }: Readonly<{
  params: { locale: string };
  children: ReactNode;
}>) {
  setContextLocale(params.locale);

  return (
    <div className="page-wrapper-base mx-3 flex min-h-screen flex-col sm:mx-2">
      <div className="flex w-full flex-col items-center px-1">
        {children}
      </div>
    </div>
  );
}
