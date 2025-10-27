import {Footer, Layout, Navbar} from 'nextra-theme-docs';
import {Head} from 'nextra/components';
import {getPageMap} from 'nextra/page-map';
import LastUpdated from '@/components/LastUpdated';
import LocaleSwitch from '@/components/LocaleSwitch';
import {defaultLocale, locales} from '@/lang';
import {Inter} from 'next/font/google';
import '../styles/globals.css';
import Image from 'next/image';
import {Metadata} from 'next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  description:
    'The Wiki for all of Modded Minecraft',
  title: {
    absolute: 'Modded Minecraft Wiki',
    template: '%s | Modded Minecraft Wiki'
  },
  metadataBase: new URL('https://docs.moddedmc.wiki')
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

export default async function RootLayout({params, children}: { params: any, children: any }) {
  const {mdxPath} = await params;
  const lang = mdxPath?.length > 0 && locales.includes(mdxPath[0]) ? mdxPath[0] : defaultLocale;

  const navbar = (
    <Navbar
      logo={
        <div className="flex flex-row gap-2 items-center">
          <Image src="/logo.png" alt="Logo" width={24} height={24}/>
          <b>Modded Minecraft Wiki</b>
        </div>
      }
      logoLink={lang != defaultLocale ? `/${lang}` : '/'}
      projectLink="https://github.com/Sinytra/Wiki"
      chatLink="https://discord.sinytra.org"
    >
      <LocaleSwitch locale={lang} locales={locales} defaultLocale={defaultLocale}/>
    </Navbar>
  );

  const pageMap = await getPageMap(`/${lang}`);
  if (lang == defaultLocale && (!mdxPath || mdxPath[0] !== defaultLocale)) {
    pageMap.forEach(transformPageMap);
  }

  return (
    <html
      lang={lang}
      dir="ltr"
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
      docsRepositoryBase="https://github.com/Sinytra/Wiki/tree/master/apps/docs"
      feedback={{ labels: 'documentation' }}
      footer={footer}
      lastUpdated={(<LastUpdated locale={lang}/>)}
    >
      {children}
    </Layout>
    </body>
    </html>
  );
}