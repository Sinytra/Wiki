import {ReactNode} from "react";
import styles from './style.module.css';
import localPreview from "@/lib/docs/localPreview";
import {Badge} from "@/components/ui/badge";
import LanguageSelect from "@/components/navigation/LanguageSelect";
import HeaderBase from "@/components/navigation/header/HeaderBase";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {cn} from "@/lib/utils";

function HeaderLink({href, children}: { href: string, children: ReactNode }) {
  return (
    <LocaleNavLink href={href} className={`${styles.menuLink} text-foreground font-medium px-1 sm:px-3`}>
      {children}
    </LocaleNavLink>
  )
}

export default async function Header({locale, minimal, unfix}: { locale: string, minimal?: boolean, unfix?: boolean }) {
  const preview = localPreview.isEnabled();

  return (
    <HeaderBase unfix={unfix}>
      <div className={cn(styles.container, 'flex flex-row gap-1 justify-between items-center px-4 sm:px-8 py-3 mx-auto', minimal && 'my-2')}>
        <div className="flex flex-row items-center gap-4">
          <LocaleNavLink href={preview ? '/preview' : '/'}>
            <span className="text-base font-medium text-foreground inline-flex gap-1 items-center">📖<span
              className="hidden md:block"> Modded Minecraft Wiki</span></span>
          </LocaleNavLink>
          {preview && <Badge variant="secondary">PREVIEW MODE</Badge>}
          {!preview &&
              <Badge variant="outline" className="border-neutral-600 text-muted-foreground font-normal">Beta</Badge>}
        </div>

        <div className="flex flex-row justify-end sm:justify-start items-center flex-wrap sm:flex-nowrap">
          <nav className="flex flex-row">
            {preview
              ?
              <HeaderLink href="/preview">Home</HeaderLink>
              :
                <>
                    <HeaderLink href="/">Home</HeaderLink>
                    {!minimal &&
                        <>
                            <HeaderLink href="/browse">Browse</HeaderLink>
                            <HeaderLink href="/about">About</HeaderLink>
                        </>
                    }
                </>
            }
          </nav>

          {!minimal && <LanguageSelect locale={locale}/>}
        </div>
      </div>
    </HeaderBase>
  )
}