import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import available from "@/lib/locales/available";
import Link from "next/link";
import {LanguagesIcon} from "lucide-react";

export default function TranslateBanner({locale}: { locale: string }) {
  const lang = available.getForUrlParam(locale);

  return (
    <Alert className="border border-[var(--vp-c-yellow-1)]">
      <LanguagesIcon className="w-5 h-5" />
      <AlertTitle>
        Looks like we're still missing translations for this language!
      </AlertTitle>
      <AlertDescription className="mt-2">
        Please help us translate the wiki's user interface into <span className="font-medium">{lang?.name}</span> on our <Link
        className="text-[var(--vp-c-brand-1)] underline underline-offset-2"
        href="https://crowdin.com/project/sinytra-wiki">Crowdin page</Link>.
      </AlertDescription>
    </Alert>
  )
}