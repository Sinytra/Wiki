import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/footer";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import available from "@/lib/locales/available";

export async function generateStaticParams() {
  return available.getLanguagePaths().map(locale => ({ locale }));
}

export default function LocaleLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode;
}>) {
  setContextLocale(params.locale);

  return (<>
    <Header locale={params.locale}/>

    {children}

    <Footer/>
  </>)
}
