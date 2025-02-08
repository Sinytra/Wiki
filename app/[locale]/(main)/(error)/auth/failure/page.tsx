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
    <div className="my-auto p-4 flex flex-col gap-4 justify-center items-center page-wrapper-ext">
      <ServerCrashIcon className="w-32 h-32 sm:w-48 sm:h-48" strokeWidth={1.5}/>

      <h1 className="text-primary text-3xl sm:text-5xl my-2">
        {t('title')}
      </h1>

      <p className="text-secondary text-center w-3/4 sm:w-full">
        {t('desc')}
      </p>

      <div className="inline-flex flex-wrap justify-center gap-4 mt-4">
        <Button variant="secondary" asChild>
          <Link href="https://status.moddedmc.org" target="_blank">
            <ActivityIcon className="mr-2 w-4 h-4" />
            {t('status')}
          </Link>
        </Button>
        <Button asChild>
          <NavLink href="/">
            <HouseIcon className="mr-2 w-4 h-4" />
            {t('return')}
          </NavLink>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="https://github.com/Sinytra/Wiki/issues" target="_blank">
            <BugIcon className="mr-2 w-4 h-4" />
            {t('report')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
