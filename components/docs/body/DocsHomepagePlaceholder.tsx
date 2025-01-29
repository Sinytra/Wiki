import {useTranslations} from "next-intl";
import {ServerOffIcon} from "lucide-react";

export default function DocsHomepagePlaceholder() {
  const t = useTranslations('DocsHomepagePlaceholder');
  
  return (
    <div className="w-full flex flex-col justify-center items-center gap-4 border border-secondary rounded-md p-5">
      <h1 className="text-2xl text-secondary">
        {t('title')}
      </h1>

      <ServerOffIcon className="text-[#3C3C43] opacity-70 my-2" width={116} height={116} />
      
      <h2 className="text-lg text-secondary max-w-[85%] text-center">
        {t('subtitle')}
      </h2>
      
      <span className="text-lg text-secondary max-w-[85%] text-center">
        {t('replace')}
      </span>
    </div>
  )
}