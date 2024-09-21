import {Button} from "@/components/ui/button";
import {BookTextIcon, CompassIcon} from "lucide-react";
import LandingStarterBase from "@/components/landing/LandingStarterBase";
import ModSearch from "@/components/landing/ModSearch";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {getLocale, getTranslations} from "next-intl/server";

export default async function UserStarter() {
  const locale = await getLocale();
  const t = await getTranslations('HomePage');

  return (
    <LandingStarterBase icon={BookTextIcon} title={t('documentation.title')}
                        desc={<span className="text-muted-foreground text-lg">{t('documentation.desc')}</span>}>
      <div className="flex flex-col gap-8 justify-center items-center w-full sm:w-fit">
        <ModSearch locale={locale} placeholder={t('documentation.search.placeholder')}/>

        <Button asChild className="text-primary-foreground">
          <LocaleNavLink href="/browse">
            <CompassIcon className="w-4 h-4 mr-2"/>
            {t('documentation.explore')}
          </LocaleNavLink>
        </Button>
      </div>
    </LandingStarterBase>
  );
}