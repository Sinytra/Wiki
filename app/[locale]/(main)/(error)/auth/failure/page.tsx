import {Button} from "@/components/ui/button";
import {ActivityIcon, BugIcon, HouseIcon, ServerCrashIcon} from "lucide-react";
import {NavLink} from "@/components/navigation/link/NavLink";
import Link from "next/link";
import {useTranslations} from "next-intl";
import {setContextLocale} from "@/lib/locales/routing";

export default function AuthFailure({params}: { params: { locale: string }}) {
  setContextLocale(params.locale);
  const t = useTranslations('AuthFailure');

  return (
    <div className="page-wrapper-ext my-auto flex flex-col items-center justify-center gap-4 p-4">
      <ServerCrashIcon className="h-32 w-32 sm:h-48 sm:w-48" strokeWidth={1.5}/>

      <h1 className="my-2 text-3xl text-primary sm:text-5xl">
        {t('title')}
      </h1>

      <p className="w-3/4 text-center text-secondary sm:w-full">
        {t('desc')}
      </p>

      <div className="mt-4 inline-flex flex-wrap justify-center gap-4">
        <Button variant="secondary" asChild>
          <Link href="https://status.moddedmc.org" target="_blank">
            <ActivityIcon className="mr-2 h-4 w-4" />
            {t('status')}
          </Link>
        </Button>
        <Button asChild>
          <NavLink href="/">
            <HouseIcon className="mr-2 h-4 w-4" />
            {t('return')}
          </NavLink>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="https://github.com/Sinytra/Wiki/issues" target="_blank">
            <BugIcon className="mr-2 h-4 w-4" />
            {t('report')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
