import {Changelog, FullChangelogEntry} from "@/lib/docs/metadata";
import {useTranslations} from "next-intl";

interface ChangelogProps {
  changelog: Changelog;
}

export default function DocsChangelogPage({changelog}: ChangelogProps) {
  const t = useTranslations('DocsChangelogPage');

  const entries = changelog
    .map(e => Object.entries(e).length === 1
      ? {version: Object.entries(e)[0][0], changes: [Object.entries(e)[0][1]]} as FullChangelogEntry
      : e as FullChangelogEntry
    );

  return (
    <div className="border-t pt-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        {t('title')}
      </h2>
      {entries.map((entry, index) => (
        <div key={index} className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold">{entry.version}
            &nbsp;{entry.date && <span className="text-sm text-muted-foreground">({entry.date})</span>}
          </h3>
          <ul className="list-disc list-inside mt-2">
            {(Array.isArray(entry.changes) ? entry.changes : [entry.changes])
              .map((change, changeIndex) => (
                <li key={changeIndex} className="text-muted-foreground">
                  {change}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

