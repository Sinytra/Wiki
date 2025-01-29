import {DEFAULT_DOCS_VERSION} from "@/lib/constants";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Tag} from "lucide-react";
import DocsVersionSelectWrapper from "@/components/docs/versions/DocsVersionSelectWrapper";
import {useTranslations} from "next-intl";

export default function DocsVersionSelector({version, versions}: { version: string; versions: Record<string, string> }) {
  const t = useTranslations('DocsVersionSelector');

  return (
    <DocsVersionSelectWrapper value={version} defaultValue={DEFAULT_DOCS_VERSION}>
      <SelectTrigger className="sm:w-[180px]">
        <Tag className="w-4 h-4 mr-1"/>
        <SelectValue placeholder={t('placeholder')}/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={DEFAULT_DOCS_VERSION}>
          {t('latest')}
        </SelectItem>
        {Object.entries(versions).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </DocsVersionSelectWrapper>
  )
}