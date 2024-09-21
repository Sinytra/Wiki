import {PencilRulerIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import LandingStarterBase from "@/components/landing/LandingStarterBase";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {useTranslations} from "next-intl";

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
        <button className="bg-blue-900 p-2.5 px-5 rounded-sm">{t('developers.area')})</button>
      </LocaleNavLink>
    </LandingStarterBase>
  )
}