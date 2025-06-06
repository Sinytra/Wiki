import {useTranslations} from "next-intl";
import {ServerOffIcon} from "lucide-react";

export default function DocsHomepagePlaceholder() {
  const t = useTranslations('DocsHomepagePlaceholder');
  
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-secondary p-5">
      <h1 className="text-2xl text-secondary">
        {t('title')}
      </h1>

      <ServerOffIcon className="my-2 text-[#3C3C43] opacity-70" width={116} height={116} />
      
      <h2 className="max-w-[85%] text-center text-lg text-secondary">
        {t('subtitle')}
      </h2>
      
      <span className="max-w-[85%] text-center text-lg text-secondary">
        {t('replace')}
      </span>
    </div>
  )
}