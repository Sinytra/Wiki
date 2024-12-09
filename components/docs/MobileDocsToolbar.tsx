import DocsBranchSelector from "@/components/docs/DocsBranchSelector";
import FilteredLanguageSelect from "@/components/docs/FilteredLanguageSelect";

export default function MobileDocsToolbar({version, versions, locale, locales}: {
  version: string;
  versions?: Record<string, string>;
  locale: string;
  locales?: string[];
}) {
  return (
    <div className="w-full gap-2 inline-flex justify-end rounded-md p-1">
      {versions &&
        <DocsBranchSelector branch={version} branches={versions}/>
      }
      {locales &&
        <FilteredLanguageSelect locale={locale} locales={locales}/>
      }
    </div>
  );
}