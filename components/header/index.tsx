import {ReactNode} from "react";
import styles from './style.module.css';
import {auth} from "@/lib/auth";

function HeaderLink({href, children}: { href: string, children: ReactNode }) {
  return (
    <a href={href} className={`${styles.menuLink} text-primary font-medium px-3`}>
      {children}
    </a>
  )
}

export default async function Header() {
  const session = await auth();

  return (
    <header className="fixed left-0 w-[100vw] bg-primary z-50">
      <div className={`${styles.container} flex flex-row justify-between items-center px-8 h-16 mx-auto`}>
        <a href="/">
          <span className="text-base font-medium text-primary">📖 Sinytra Wiki</span>
        </a>

        <div className="flex flex-row items-center">
          <nav className="flex flex-row">
            <HeaderLink href="/">Home</HeaderLink>
            <HeaderLink href="/">Browse</HeaderLink>
          </nav>

          {session == null
            ?
            <div className={`${styles.socialLinks} inline-flex`}>
              <HeaderLink href="/auth/login">Login</HeaderLink>
            </div>
            :
            <>
              <div className={`${styles.socialLinks} inline-flex`}>
                <HeaderLink href="/dev">Dashboard</HeaderLink>
              </div>
              <div className={`${styles.socialLinks} inline-flex`}>
                <HeaderLink href="/auth/logout">Logout</HeaderLink>
              </div>
            </>
          }
        </div>
      </div>
    </header>
  )
}