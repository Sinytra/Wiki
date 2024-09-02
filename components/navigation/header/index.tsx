import {ReactNode} from "react";
import styles from './style.module.css';
import {auth, signOut} from "@/lib/auth";
import {Button} from "@/components/ui/button";
import {LogOutIcon} from "lucide-react";
import localPreview from "@/lib/docs/localPreview";
import {Badge} from "@/components/ui/badge";
import LanguageSelect from "@/components/navigation/LanguageSelect";
import HeaderBase from "@/components/navigation/header/HeaderBase";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

function HeaderLink({href, children}: { href: string, children: ReactNode }) {
  return (
    <LocaleNavLink href={href} className={`${styles.menuLink} text-foreground font-medium px-3`}>
      {children}
    </LocaleNavLink>
  )
}

export default async function Header({ locale }: { locale: string }) {
  const session = await auth();
  const preview = localPreview.isEnabled();

  return (
    <HeaderBase>
      <div className={`${styles.container} flex flex-row justify-between items-center px-8 h-16 mx-auto`}>
        <div className="flex flex-row items-center gap-4">
          <LocaleNavLink href="/">
            <span className="text-base font-medium text-foreground">📖 Sinytra Modded Wiki</span>
          </LocaleNavLink>
          {preview && <Badge variant="secondary">PREVIEW MODE</Badge>}
          {!preview && <Badge variant="outline" className="border-neutral-600 text-muted-foreground font-normal">Beta</Badge>}
        </div>

        {preview
          ?
          <HeaderLink href="/preview">Home</HeaderLink>
          :
          <div className="flex flex-row items-center">
            <nav className="flex flex-row">
              <HeaderLink href="/">Home</HeaderLink>
              <HeaderLink href="/browse">Browse</HeaderLink>
              <HeaderLink href="/about">About</HeaderLink>
            </nav>

            <LanguageSelect locale={locale}/>

            {session !== null &&
                <>
                    <div className={styles.socialLinks}>
                        <HeaderLink href="/dev">Dashboard</HeaderLink>
                    </div>
                    <div className={styles.socialLinks}>
                        <form
                            action={async () => {
                              "use server"
                              await signOut({redirectTo: '/'});
                            }}
                        >
                            <Button type="submit" variant="ghost" size="icon">
                                <LogOutIcon className="h-4 w-4"/>
                            </Button>
                        </form>
                    </div>
                </>
            }
          </div>
        }
      </div>
    </HeaderBase>
  )
}