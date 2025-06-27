import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/Footer";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import locales from "@repo/shared/lang/locales";

export async function generateStaticParams() {
  return locales.getLanguagePaths().map(locale => ({locale}));
}

export default function LocaleLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode;
}>) {
  setContextLocale(params.locale);

  const isRTL = locales.isRTL(params.locale);

  return (
    <div className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : ''}>
      <Header locale={params.locale}/>

      <div>
        {children}
      </div>

      <Footer/>
    </div>
  )
}
