import {ReactNode} from "react";
import styles from './style.module.css';

function HeaderLink({href, children}: { href: string, children: ReactNode }) {
  return (
    <a href={href} className={`${styles.menuLink} text-primary font-medium px-3`}>
      {children}
    </a>
  )
}

export default function Header() {
  return (
    <header className="fixed w-full">
      <div className={`${styles.container} flex flex-row justify-between items-center px-8 h-16 mx-auto`}>
        <span className="text-base font-medium text-primary">📖 Sinytra Wiki</span>

        <div className="flex flex-row items-center">
          <nav className="flex flex-row">
            <HeaderLink href="/">Home</HeaderLink>
            <HeaderLink href="/">Browse</HeaderLink>
          </nav>

          <div className={`${styles.socialLinks} inline-flex`}>
            <HeaderLink href="/">Login</HeaderLink>
          </div>

          <div className={`${styles.socialLinks} inline-flex`}>
            <HeaderLink href="/">GitHub</HeaderLink>
          </div>
        </div>
      </div>
    </header>
  )
}