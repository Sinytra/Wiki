import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/Footer";
import {ReactNode} from "react";
import {setContextLocale} from "@/lib/locales/routing";
import locales from "@repo/shared/locales";
import {NextIntlClientProvider} from "next-intl";
import {Toaster} from "@repo/ui/components/sonner";
import CookieConsentContextProvider from "@/components/cookies/CookieConsentContextProvider";
import {getMessages} from "next-intl/server";
import {pick} from "lodash";

export async function generateStaticParams() {
  return locales.getLanguagePaths().map(locale => ({locale}));
}

type Params = Promise<{ locale: string }>;

export default async function LocaleLayout(props: { params: Params; children: ReactNode; }) {
  const params = await props.params;
  const {children} = props;
  setContextLocale(params.locale);

  const isRTL = locales.isRTL(params.locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={params.locale} messages={pick(messages, 'CookieConsent')}>
      <CookieConsentContextProvider>
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
      </CookieConsentContextProvider>
    </NextIntlClientProvider>
  )
}
