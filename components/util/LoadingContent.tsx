import {LoaderCircleIcon} from "lucide-react";
import {useTranslations} from "next-intl";

export default function LoadingContent() {
  const t = useTranslations('LoadingContent');

  return (
    <div className="flex items-center text-base text-secondary">
      <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin"/>
      {t('message')}
    </div>
  )
}