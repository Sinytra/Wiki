import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/Footer";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import locales from "@repo/lang/locales";
import {NextIntlClientProvider} from "next-intl";
import {Toaster} from "@repo/ui/components/sonner";

export async function generateStaticParams() {
  return locales.getLanguagePaths().map(locale => ({locale}));
}

type Params = Promise<{ locale: string }>;

export default async function LocaleLayout(props: { params: Params; children: ReactNode; }) {
  const params = await props.params;
  const {children} = props;
  setContextLocale(params.locale);

  const isRTL = locales.isRTL(params.locale);

  return (
    <NextIntlClientProvider locale={params.locale}>
      <div className={isRTL ? 'rtl' : ''} dir={isRTL ? 'rtl' : ''}>
        <Header locale={params.locale}/>

        <div>
          {children}
        </div>

        <Footer/>
      </div>
      {/* TODO Font size */}
      <Toaster toastOptions={{
        style: {
          background: 'var(--background-color-primary-alt)',
          fontStyle: 'var(--text-sm)'
        }
      }}/>
    </NextIntlClientProvider>
  )
}
