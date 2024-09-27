import {CompassIcon, HammerIcon, HomeIcon, PencilIcon, PencilRulerIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import LandingStarterBase from "@/components/landing/LandingStarterBase";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";

export default function DevStarter() {
  const t = useTranslations('HomePage');

  return (
    <LandingStarterBase icon={PencilRulerIcon} title={t('developers.title')} desc={
      <>
        <span className="text-muted-foreground text-lg">{t('developers.desc')}</span>
        <span className="text-muted-foreground text-lg">
          {t.rich('developers.guide', {
            guide: (chunks) => (
              <LinkTextButton className="!text-foreground !font-normal !text-lg underline" href="/about/devs">
                {chunks}
              </LinkTextButton>
            )
          })}
        </span>
      </>
    }>
      <LocaleNavLink href="/dev">
        <Button variant="outline" className="!border-muted-foreground">
          <HammerIcon className="w-4 h-4 mr-2"/>
          {t('developers.area')}
        </Button>
      </LocaleNavLink>
    </LandingStarterBase>
  )
}