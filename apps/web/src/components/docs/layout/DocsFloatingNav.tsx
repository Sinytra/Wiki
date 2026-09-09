'use client';

import { ReactNode, useContext } from 'react';
import { CompassIcon, SearchIcon, XIcon } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { Button } from '@repo/ui/components/button';
import { MobileNavContext } from '@/components/docs/side/MobileNavContext';

interface Props {
  className?: string;
  children?: ReactNode;
}

export function FloatingNavButton({
  icon: Icon,
  open,
  setOpen,
  className
}: {
  icon: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'size-9 border-0 bg-primary-alt p-0',
        open ? 'bg-secondary text-primary-alt' : 'hover:bg-secondary',
        className
      )}
    >
      {open ? <XIcon className="size-5 shrink-0" /> : <Icon className="size-5 shrink-0" />}
    </Button>
  );
}

export default function DocsFloatingNav({ className, children }: Props) {
  const { open, setOpen } = useContext(MobileNavContext)!;

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 z-60 -translate-x-1/2 lg:hidden',
        'flex flex-row gap-1.5 rounded-md border border-tertiary bg-primary-alt p-1 shadow-lg wide-layout:hidden',
        className
      )}
    >
      {open === 'search' ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpen('none')}
          className="pointer-events-auto size-9 border-0 bg-primary-alt p-0 sm:hidden"
        >
          <XIcon className="size-5 shrink-0" />
        </Button>
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            className="h-9 px-2 text-secondary sm:hidden"
            onClick={() => setOpen('search')}
          >
            <SearchIcon className="mr-3 size-4" />
            Search
          </Button>

          {children}

          <FloatingNavButton
            icon={CompassIcon}
            className="pointer-events-auto sm:hidden"
            open={open === 'project-nav'}
            setOpen={() => setOpen(open !== 'project-nav' ? 'project-nav' : 'none')}
          />
        </>
      )}
    </div>
  );
}
