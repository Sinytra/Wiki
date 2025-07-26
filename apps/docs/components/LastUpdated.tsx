'use client';

import type {ReactNode} from 'react';

interface Props {
  date?: Date;
  children?: ReactNode;
  locale?: string;
}

export default function LastUpdated({date, children = 'Last updated on', locale}: Props) {
  if (!date) {
    return null;
  }
  return (
    <div className="text-sm text-neutral-400! font-medium">
      {children}{' '}
      <time
        dateTime={date.toISOString()}
        // Can provoke React 418 error https://react.dev/errors/418
        suppressHydrationWarning
        className="text-neutral-400!"
      >
        {date.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </time>
    </div>
  );
}
