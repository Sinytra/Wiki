import {Footer, Layout, Navbar} from 'nextra-theme-docs';
import {Head} from 'nextra/components';
import {getPageMap} from 'nextra/page-map';
import LastUpdated from '@/components/LastUpdated';
import LocaleSwitch from '@/components/LocaleSwitch';
import {locales, defaultLocale} from '@/lang';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
});

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const footer = <Footer>{new Date().getFullYear()} © Sinytra.</Footer>;

function transformPageMap(item: any) {
  if ('route' in item && item.route.startsWith(`/${defaultLocale}`)) {
    item.route = item.route == `/${defaultLocale}` ? '/' : item.route.substring(3);
  }
  if ('children' in item && item.children) {
    item.children.forEach(transformPageMap);
  }
}

export default async function RootLayout({ params, children }: { params: any, children: any }) {
  const {mdxPath} = await params;
  const lang = mdxPath?.length > 0 && locales.includes(mdxPath[0]) ? mdxPath[0] : defaultLocale;

  const navbar = (
    <Navbar
      logo={<b>Modded Minecraft Wiki</b>}
      logoLink={lang != defaultLocale ? `/${lang}` : '/'}
    >
      <LocaleSwitch locale={lang} locales={locales} defaultLocale={defaultLocale} />
    </Navbar>
  );

  const pageMap = await getPageMap(`/${lang}`);
  if (lang == defaultLocale && (!mdxPath || mdxPath[0] !== defaultLocale)) {
    pageMap.forEach(transformPageMap);
  }

  return (
    <html
      lang={lang}
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
      className={inter.className}
    >
    <Head>
      {/* Your additional tags should be passed as `children` of `<Head>` element */}
    </Head>
    <body>
    <Layout
      navbar={navbar}
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
      footer={footer}
      lastUpdated={(<LastUpdated locale={lang} />)}
    >
      {children}
    </Layout>
    </body>
    </html>
  );
}