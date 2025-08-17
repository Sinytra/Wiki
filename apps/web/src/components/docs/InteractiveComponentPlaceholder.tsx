import {useTranslations} from "next-intl";
import {ServerOffIcon} from "lucide-react";

export default function InteractiveComponentPlaceholder() {
  const t = useTranslations('InteractiveComponentPlaceholder');

  return (
    <div className={`
      flex h-64 flex-col items-center justify-center gap-3 rounded-sm border border-tertiary bg-primary-dim
    `}>
      <span className="flex flex-row items-center gap-2 text-xl opacity-70">
        <ServerOffIcon className="size-6" />
        {t('title')}
      </span>

      <span className="max-w-md text-center text-secondary opacity-70">
        {t('desc')}
      </span>
    </div>
  )
}