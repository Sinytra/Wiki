'use client';

import { cn } from '@repo/ui/lib/utils';
import { forwardRef, useContext } from 'react';
import { MobileNavContext, NavMenuType } from '@/components/docs/side/MobileNavContext';
import { XIcon } from 'lucide-react';
import { Button } from '@repo/ui/components/button';

export interface DocsSidebarBaseProps {
  title: string;
  className?: string;
  innerClassName?: string;
  tagName?: string;
  children?: any;
  solid?: boolean;
  type: 'left' | 'right';
}

const variants = {
  left: {
    aside: cn(
      'fixed bottom-0 h-[628px]',
      'lg:inset-auto lg:top-25! lg:z-30 lg:h-[calc(100vh-9.5rem)] lg:transition-none',
      'lg:data-[open=false]:visible lg:data-[open=false]:translate-y-0 lg:data-[open=false]:opacity-100'
    ),
    position: { solid: 'lg:static', sticky: 'lg:sticky' },
    inner: 'lg:max-w-none lg:pt-4 lg:pb-4',
    close: 'lg:hidden'
  },
  right: {
    aside: cn(
      'md:inset-auto md:right-4 md:bottom-20 md:h-auto md:w-80 md:rounded-md md:border md:shadow-xl',
      'wide-layout:top-25! wide-layout:right-auto! wide-layout:bottom-auto! wide-layout:z-30 wide-layout:transition-none',
      'wide-layout:h-[calc(100vh-9.5rem)]! wide-layout:w-64! wide-layout:rounded-none! wide-layout:border-0! wide-layout:shadow-none!',
      'wide-layout:data-[open=false]:visible wide-layout:data-[open=false]:translate-y-0 wide-layout:data-[open=false]:opacity-100'
    ),
    position: { solid: 'wide-layout:static', sticky: 'wide-layout:sticky' },
    inner: 'md:h-auto md:max-h-[70vh] md:max-w-none md:pt-4 md:pb-4 wide-layout:h-full! wide-layout:max-h-none!',
    close: 'wide-layout:hidden'
  }
};

const DocsSidebarBase = forwardRef<HTMLElement, DocsSidebarBaseProps>(function DocsSidebarBase(
  { title, className, innerClassName, tagName, children, type, solid }: DocsSidebarBaseProps,
  ref
) {
  const ContentDiv = tagName || ('div' as any);

  const { open, setOpen } = useContext(MobileNavContext)!;
  const isMenu = type === 'left';
  const menuType: NavMenuType = type === 'left' ? 'file-tree' : 'none';
  const styles = variants[type];

  return (
    <>
      <div
        data-open={isMenu && open == menuType}
        className="fixed inset-0 z-50 hidden bg-black opacity-60 data-[open=true]:block"
      />
      <aside
        data-open={isMenu && open == menuType}
        className={cn(
          className,
          'pointer-events-auto fixed z-[60] h-dvh w-full overflow-hidden border-tertiary',
          'data-[open=false]:invisible data-[open=false]:translate-y-3 data-[open=false]:opacity-0',
          styles.aside,
          solid ? styles.position.solid : styles.position.sticky
        )}
      >
        <ContentDiv
          ref={ref}
          className={cn(
            'mx-auto scrollbar-none h-full w-full max-w-lg space-y-2 overflow-y-auto overscroll-contain p-4',
            'border-tertiary lg:border-0! mobile:rounded-t-sm mobile:border mobile:border-b-0',
            'pt-4 pb-24',
            styles.inner,
            innerClassName
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-secondary">{title}</h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen('none')}
              className={cn('-m-1 size-8 cursor-pointer p-1 text-secondary hover:text-primary', styles.close)}
            >
              <XIcon className="size-5" />
            </Button>
          </div>

          {children}
        </ContentDiv>
      </aside>
    </>
  );
});

export default DocsSidebarBase;
