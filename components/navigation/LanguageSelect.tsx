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
import available from "@/lib/locales/available";
import {usePathname} from "@/lib/locales/routing";
import {useRouter} from 'next-nprogress-bar';
import {useState} from "react";
import {Language} from "@/lib/types/available";

function LanguageOption({ id, name, icon, active, onNavigate }: { id: string; name: string; icon: any; active: boolean; onNavigate: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const changeLocale = (id: any) => {
    const parts = pathname.split('/');
    parts[0] = id;
    router.replace('/' + parts.join('/'));
    onNavigate();
  };

  return (
    <Button variant={active ? 'secondary' : 'ghost'} size="sm" className="w-full inline-flex justify-start items-center gap-3" onClick={() => changeLocale(id)}>
      <CountryFlag flag={icon}/> {name}
    </Button>
  )
}

export default function LanguageSelect({ locale }: { locale: string }) {
  const availableLocales = available.getAvailableLocales() as {[key: string]: Language};
  const [value, setValue] = useState('');

  return (
    <div className={styles.socialLinks}>
      <div>
        <NavigationMenu className="[&_div.absolute]:-left-[6.7rem]" value={value} onValueChange={setValue}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="p-1 h-fit sm:h-10 sm:!px-2">
                <LanguagesIcon className="w-5 h-5"/>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-3 whitespace-nowrap flex flex-col justify-start items-start">
                {...Object.keys(availableLocales).filter(l => availableLocales[l] !== undefined).map(l => {
                  const name = availableLocales[l];
                  return <LanguageOption key={l} id={l} name={name.name} icon={name.icon} active={locale === l} onNavigate={() => setValue('')} />
                })}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}