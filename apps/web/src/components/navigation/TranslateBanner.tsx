import {Alert, AlertDescription, AlertTitle} from "@repo/ui/components/alert";
import {LanguagesIcon} from "lucide-react";
import locales from "@repo/shared/locales";
import env from "@repo/shared/env";
import {NavLink} from "@/components/navigation/link/NavLink";

export default function TranslateBanner({locale}: { locale: string }) {
  const url = env.getCrowdinUrl();
  if (!url) return null;
  const lang = locales.getForUrlParam(locale)!;

  return (
    <Alert className="border border-warning">
      <LanguagesIcon className="h-5 w-5"/>
      <AlertTitle>
        Looks like we're still missing translations for this language!
      </AlertTitle>
      <AlertDescription className="mt-2">
        Please help us translate the wiki's user interface into <span className="font-medium">{lang?.name}</span> on
        our <NavLink
        className="text-brand-primary underline underline-offset-2"
        href={url}>Crowdin page</NavLink>.
      </AlertDescription>
    </Alert>
  )
}