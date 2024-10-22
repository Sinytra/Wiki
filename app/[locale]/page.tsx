import DevStarter from "@/components/landing/DevStarter";
import LandingWidget from "@/components/landing/LandingWidget";
import UserStarter from "@/components/landing/UserStarter";
import {setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from 'next-intl';
import {cn} from "@/lib/utils";
import TranslateBanner from "@/components/landing/TranslateBanner";
import Link from "next/link";
import crowdin from "@/lib/locales/crowdin";

export const dynamic = 'force-static';

function HomePageContent() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex max-w-5xl mx-auto flex-col items-center justify-between w-full px-2 md:px-0">
      <div className="mb-6 sm:mb-0 z-10 w-full items-center justify-center text-2xl md:flex">
        <p className="text-3xl md:text-4xl text-foreground flex flex-col lg:flex-row items-center gap-x-2">
          {t.rich('heading', {
            highlight: (chunks) => (
              <span
                className="text-center font-medium bg-gradient-to-b from-blue-400 to-blue-500 bg-clip-text text-transparent">
                    {chunks}
                  </span>
            )
          })}
        </p>
      </div>

      <div className="flex flex-col h-full justify-evenly gap-12 sm:gap-10 md:gap-0 mt-10 md:mt-0">
        <UserStarter/>

        <hr className="md:w-[45rem] border-gray-600 h-1"/>

        <DevStarter/>

        <hr className="md:hidden border-gray-600 h-1"/>
      </div>

      <div className="mt-6 md:mt-0 grid text-center md:mb-0 md:w-full md:max-w-5xl md:grid-cols-4 md:text-left gap-4">
        <LandingWidget title={t('links.about.title')} href="/about">
          {t('links.about.desc')}
        </LandingWidget>

        <LandingWidget title={t('links.browse.title')} href="/browse">
          {t('links.browse.desc')}
        </LandingWidget>

        <LandingWidget title={t('links.devs.title')} href="/about/devs">
          {t('links.devs.desc')}
        </LandingWidget>

        <LandingWidget title={t('links.blog.title')} href="/blog" link={Link}>
          {t('links.blog.desc')}
        </LandingWidget>
      </div>
    </main>
  );
}

export default async function Home({params}: { params: { locale: string } }) {
  setContextLocale(params.locale);

  const showBanner = params.locale !== 'en' && await crowdin.getCrowdinTranslationStatus(params.locale) < 50;

  return <>
    {showBanner &&
        <div className="page-wrapper max-w-5xl mx-auto w-full px-5">
            <TranslateBanner locale={params.locale}/>
        </div>
    }

    <div className={cn(showBanner && '!pt-0', "page-wrapper flex flex-1 min-h-[100vh] mx-4 sm:mx-2")}>
      <HomePageContent/>
    </div>
  </>
}
