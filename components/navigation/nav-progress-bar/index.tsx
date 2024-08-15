'use client';

import {AppProgressBar as ProgressBar} from 'next-nprogress-bar';

const Providers = ({children}: { children: any }) => {
  return (
    <>
      {children}
      <ProgressBar
        color="var(--vp-c-blue-1)"
        delay={500}
        options={{showSpinner: false}}
      />
    </>
  );
};

export default Providers;
