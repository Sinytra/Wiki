'use client'

import {useChangeLocale, useCurrentLocale} from "@/lib/locales/client";
import styles from "@/components/navigation/header/style.module.css";
import {
  NavigationMenu, NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {LanguagesIcon} from "lucide-react";
import CountryFlag from "@/components/util/CountryFlag";
import {CN, CZ, DE, ES, FR, GB, HU, IT, JP, KR, PL, RU, SE, UA} from "country-flag-icons/react/3x2";
import {Button} from "@/components/ui/button";
import {getAvailableLocales} from "@/lib/locales/available";

function LanguageOption({ id, name, icon, active }: { id: string; name: string, icon: any, active: boolean }) {
  const changeLocale = useChangeLocale();

  return (
    <Button variant={active ? 'secondary' : 'ghost'} size="sm" className="w-full inline-flex justify-start items-center gap-3" onClick={() => changeLocale(id)}>
      <CountryFlag flag={icon}/> {name}
    </Button>
  )
}

const localeNames: {[key: string]: {name: string, icon: any}} = {
  en: { name: 'English', icon: GB },
  de: { name: 'Deutsch', icon: DE },
  fr: { name: 'Français', icon: FR },
  es: { name: 'Español', icon: ES },
  it: { name: 'Italiano', icon: IT },
  cz: { name: 'Čeština', icon: CZ },
  hu: { name: 'Magyar', icon: HU },
  pl: { name: 'Polski', icon: PL },
  sw: { name: 'Svenska', icon: SE },
  ua: { name: 'Українська', icon: UA },
  ru: { name: 'русский', icon: RU },
  jp: { name: '日本語', icon: JP },
  kr: { name: '한국어', icon: KR },
  cn: { name: '中文', icon: CN }
};

export default function LanguageSelect() {
  const locale = useCurrentLocale();
  const availableLocales = Object.keys(getAvailableLocales());

  return (
    <div className={styles.socialLinks}>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="!px-2">
                <LanguagesIcon className="w-5 h-5"/>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-3 whitespace-nowrap flex flex-col justify-start items-start">
                {...availableLocales.filter(l => localeNames[l] !== undefined).map(l => {
                  const name = localeNames[l];
                  return <LanguageOption key={l} id={l} name={name.name} icon={name.icon} active={locale === l} />
                })}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}