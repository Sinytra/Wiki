import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>

export default async function RootLayout({ params, children }: { params: any, children: any }) {
  const {lang} = await params;

  const navbar = (
    <Navbar
      logo={<b>Nextra</b>}
      logoLink={`/${lang}`}
      // ... Your additional navbar options
    />
  );

  return (
    <html
      // Not required, but good for SEO
      lang={lang}
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
    <Head
      // ... Your additional head options
    >
      {/* Your additional tags should be passed as `children` of `<Head>` element */}
    </Head>
    <body>
    <Layout
      banner={banner}
      navbar={navbar}
      pageMap={await getPageMap(`/${lang}`)}
      docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
      footer={footer}
      // ... Your additional layout options
    >
      {children}
    </Layout>
    </body>
    </html>
  )
}