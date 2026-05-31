import {ChangelogEntry} from '@sinytra/wiki-api-types';

interface ChangelogProps {
  changelog: ChangelogEntry[];
}

export default function ContentChangelog({changelog}: ChangelogProps) {
  return (
    <div className="space-y-2">
      {changelog.map((entry, index) => (
        <div key={index} className="border-tertiary not-last:border-b not-last:pb-4">
          <h3 className="flex flex-row items-center justify-between text-lg font-semibold">
            {entry.version}
            {entry.date && <span className="text-sm font-medium text-secondary">{entry.date}</span>}
          </h3>
          <ul className="mt-2 list-inside list-disc">
            {entry.changes
              .map((change, changeIndex) => (
                <li key={changeIndex} className="text-secondary">
                  {change}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

