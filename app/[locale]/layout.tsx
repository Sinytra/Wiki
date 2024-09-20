import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/footer";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";

export default function LocaleLayout({params, children}: Readonly<{
  params: { locale: string };
  children: ReactNode;
}>) {
  setContextLocale(params.locale);

  return (<>
    <Header locale={params.locale}/>

    <div className="page-wrapper flex flex-1 min-h-[100vh] mx-2">
      {children}
    </div>

    <Footer/>
  </>)
}