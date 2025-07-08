import {Changelog, FullChangelogEntry} from "@repo/shared/types/metadata";

interface ChangelogProps {
  changelog: Changelog;
}

export default function ContentChangelog({changelog}: ChangelogProps) {
  const entries = changelog
    .map(e => Object.entries(e).length === 1
      ? {version: Object.entries(e)![0]![0], changes: [Object.entries(e)![0]![1]]} as FullChangelogEntry
      : e as FullChangelogEntry
    );

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div key={index} className="border-tertiary not-last:border-b not-last:pb-4">
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

