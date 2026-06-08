import { useMDXComponents } from 'nextra-theme-docs';
import { ReactNode } from 'react';

export default function FormatHeader({ children }: { schema: string; children: ReactNode }) {
  const { h2: H2 } = useMDXComponents();
  return <H2 className="flex items-center justify-between gap-4">{children}</H2>;
}
