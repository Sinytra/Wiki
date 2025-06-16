'use client';

import {ProgressProvider} from '@bprogress/next/app';

const Providers = ({children}: { children: any }) => {
  return (
    <>
      <ProgressProvider
        color="var(--vp-c-blue-1)"
        delay={500}
        options={{showSpinner: false}}
      >
        {children}
      </ProgressProvider>
    </>
  );
};

export default Providers;
