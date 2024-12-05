'use client'

import styles from "@/components/navigation/header/style.module.css";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {LanguagesIcon} from "lucide-react";
import CountryFlag from "@/components/util/CountryFlag";
import {Button} from "@/components/ui/button";
import {usePathname} from "@/lib/locales/routing";
import {useRouter} from 'next-nprogress-bar';
import {useState} from "react";
import available from "@/lib/locales/available";
import {cn} from "@/lib/utils";

function LanguageOption({id, name, icon, active, onNavigate}: {
  id: string;
  name: string;
  icon: any;
  active: boolean;
  onNavigate: () => void
}) {
  const pathname = usePathname();
  const router = useRouter();
  const changeLocale = (id: any) => {
    const parts = pathname.split('/');
    parts[0] = id;
    router.replace('/' + parts.join('/'));
    onNavigate();
  };

  return (
    <Button variant={active ? 'secondary' : 'ghost'} size="sm"
            className="w-full inline-flex justify-start items-center gap-3" onClick={() => changeLocale(id)}>
      <CountryFlag flag={icon}/> {name}
    </Button>
  )
}

export default function LanguageSelect({locale, locales, minimal, smallOffset}: {
  locale: string;
  locales?: string[];
  minimal?: boolean;
  smallOffset?: boolean;
}) {
  const allLocales = available.getAvailableLocales();
  const availableLocales = locales ? Object.keys(allLocales)
    .filter(k => locales.includes(k))
    .reduce((obj: any, key) => {
      obj[key] = allLocales[key];
      return obj;
    }, {}) : allLocales;
  const [value, setValue] = useState('');

  return (
    <div className={cn(!minimal && styles.socialLinks)}>
      <div>
        <NavigationMenu className={cn(smallOffset ? '[&_div.absolute]:-left-[6rem] [&_div.absolute]:md:-left-0' : '[&_div.absolute]:-left-[6.7rem]')} value={value} onValueChange={setValue}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn("h-fit sm:h-10 sm:!px-2 p-1", minimal ? 'bg-transparent' : '')}>
                <LanguagesIcon className="w-5 h-5"/>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-3 gap-0.5 whitespace-nowrap flex flex-col justify-start items-start">
                {...Object.keys(availableLocales).map(id => {
                  const {name, icon, prefix} = availableLocales[id];
                  return <LanguageOption key={id} id={prefix || id} name={name} icon={icon} active={locale === id}
                                         onNavigate={() => setValue('')}/>
                })}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}