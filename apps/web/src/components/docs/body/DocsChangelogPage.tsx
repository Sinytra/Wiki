import {useTranslations} from 'next-intl';
import {ChangelogEntry} from '@sinytra/wiki-api-types';

interface ChangelogProps {
  changelog: ChangelogEntry[];
}

export default function DocsChangelogPage({changelog}: ChangelogProps) {
  const t = useTranslations('DocsChangelogPage');

  return (
    <div className="space-y-6">
      <h2 className="mb-4 text-xl font-semibold">
        {t('title')}
      </h2>
      {changelog.map((entry, index) => (
        <div key={index} className="border-b border-border pb-4">
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

