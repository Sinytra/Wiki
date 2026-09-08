import { ReactNode } from 'react';
import { setContextLocale } from '@/lib/locales/routing';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/Footer';
import ClientLocaleProvider from '@repo/ui/util/ClientLocaleProvider';
import SearchContextProvider from '@/components/navigation/search/SearchContext';
import MobileNavContextProvider from '@/components/docs/side/MobileNavContext';

export const dynamic = 'force-static';

export default function BlogLayout({ children }: Readonly<{ children: ReactNode }>) {
  setContextLocale('en');

  return (
    <>
      <SearchContextProvider>
        <ClientLocaleProvider keys={[]}>
          <MobileNavContextProvider>
            <Header locale="en" minimal unfix />

            <div className="mx-2 flex min-h-screen flex-1 pb-24">
              <div className="flex w-full flex-col items-center gap-4">
                <div className="prose w-full max-w-4xl px-2 md:px-0 dark:prose-invert prose-h2:border-b prose-h2:border-b-secondary prose-h2:pb-1">
                  {children}
                </div>
              </div>
            </div>

            <Footer />
          </MobileNavContextProvider>
        </ClientLocaleProvider>
      </SearchContextProvider>
    </>
  );
}
