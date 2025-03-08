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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        {t('title')}
      </h2>
      {entries.map((entry, index) => (
        <div key={index} className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold flex flex-row items-center justify-between">
            {entry.version}
            {entry.date && <span className="text-sm text-secondary font-medium">{entry.date}</span>}
          </h3>
          <ul className="list-disc list-inside mt-2">
            {(Array.isArray(entry.changes) ? entry.changes : [entry.changes])
              .map((change, changeIndex) => (
                <li key={changeIndex} className="text-secondary">
                  {change}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

