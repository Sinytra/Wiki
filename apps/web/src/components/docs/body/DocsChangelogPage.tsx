import {Changelog, FullChangelogEntry} from "@repo/shared/types/metadata";
import {useTranslations} from "next-intl";

interface ChangelogProps {
  changelog: Changelog;
}

export default function DocsChangelogPage({changelog}: ChangelogProps) {
  const t = useTranslations('DocsChangelogPage');

  const entries = changelog
    .map(e => Object.entries(e).length === 1
      ? {version: Object.entries(e)![0]![0], changes: [Object.entries(e)![0]![1]]} as FullChangelogEntry
      : e as FullChangelogEntry
    );

  return (
    <div className="space-y-6">
      <h2 className="mb-4 text-xl font-semibold">
        {t('title')}
      </h2>
      {entries.map((entry, index) => (
        <div key={index} className="border-b border-border pb-4">
          <h3 className="flex flex-row items-center justify-between text-lg font-semibold">
            {entry.version}
            {entry.date && <span className="text-sm font-medium text-secondary">{entry.date}</span>}
          </h3>
          <ul className="mt-2 list-inside list-disc">
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

