'use client';

import { Toaster as Sonner } from 'sonner';
import React, { useEffect, useState } from 'react';

type ToasterProps = React.ComponentProps<typeof Sonner>;
type ResolvedTheme = 'light' | 'dark';

function useDocumentTheme(): ResolvedTheme {
  const [theme, setTheme] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    const readTheme = () => setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    readTheme();

    const observer = new MutationObserver(readTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useDocumentTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-primary group-[.toaster]:text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-secondary',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-inverse',
          cancelButton: 'group-[.toast]:bg-primary-alt group-[.toast]:text-secondary'
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
