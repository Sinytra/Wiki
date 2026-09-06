import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/ui/lib/utils';

const alertVariants = cva(
  `relative w-full rounded-sm border p-3 [&>svg]:absolute [&>svg]:top-3 [&>svg]:left-3 [&>svg]:text-primary [&>svg]:rtl:right-3 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7 [&>svg~*]:rtl:pr-7`,
  {
    variants: {
      variant: {
        note: 'border-note text-note [&>svg]:text-note-icon',
        tip: 'border-tip text-tip [&>svg]:text-tip-icon',
        important: 'border-important text-important [&>svg]:text-important-icon',
        warning: 'border-warning text-warning [&>svg]:text-warning',
        caution: 'border-caution text-caution [&>svg]:text-caution-icon'
      }
    },
    defaultVariants: {
      variant: 'note'
    }
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-2 leading-none font-medium tracking-tight', className)} {...props} />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
);
AlertDescription.displayName = 'AlertDescription';

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

export { Alert, AlertTitle, AlertDescription };
