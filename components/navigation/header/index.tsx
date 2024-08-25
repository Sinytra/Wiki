import {ReactNode} from "react";
import styles from './style.module.css';
import {auth, signOut} from "@/lib/auth";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LogOutIcon} from "lucide-react";

function HeaderLink({href, children}: { href: string, children: ReactNode }) {
  return (
    <Link href={href} className={`${styles.menuLink} text-foreground font-medium px-3`}>
      {children}
    </Link>
  )
}

export default async function Header() {
  const session = await auth();

  return (
    <header className="fixed left-0 w-[100vw] bg-background z-50">
      <div className={`${styles.container} flex flex-row justify-between items-center px-8 h-16 mx-auto`}>
        <Link href="/">
          <span className="text-base font-medium text-foreground">📖 Sinytra Wiki</span>
        </Link>

        <div className="flex flex-row items-center">
          <nav className="flex flex-row">
            <HeaderLink href="/">Home</HeaderLink>
            <HeaderLink href="/browse">Browse</HeaderLink>
            <HeaderLink href="/about">About</HeaderLink>
          </nav>

          {session !== null &&
            <>
              <div className={`${styles.socialLinks}`}>
                <HeaderLink href="/dev">Dashboard</HeaderLink>
              </div>
              <div className={`${styles.socialLinks}`}>
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: '/' });
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
      </div>
    </header>
  )
}