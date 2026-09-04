'use client';

import { ReactNode, useEffect, useState } from 'react';

const ENCODED_ADDRESS = 'Y29udGFjdEBtb2RkZWRtYy53aWtp';

function protectAddress(address: string): string {
  const [user, domain] = address.split('@');
  return `${user} [at] ${domain!.replaceAll('.', ' [dot] ')}`;
}

export default function ContactEmail({ children, className }: { children?: ReactNode; className?: string }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => setAddress(atob(ENCODED_ADDRESS)), []);

  if (address === null) {
    return <span className={className}>{children ?? protectAddress(atob(ENCODED_ADDRESS))}</span>;
  }

  return (
    <a className={className} href={`mailto:${address}`}>
      {children ?? address}
    </a>
  );
}
