'use client';

import {ProgressProvider} from '@bprogress/next/app';

export default function NavProgressBar({children}: { children: any }) {
  return (
    <ProgressProvider
      color="var(--color-progressbar)"
      delay={500}
      options={{showSpinner: false}}
    >
      {children}
    </ProgressProvider>
  );
}
