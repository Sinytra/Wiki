import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@repo/ui/lib/utils';

const badgeVariants = cva(
  `inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden`,
  {
    variants: {
      variant: {
        default: 'text-inverse border-transparent bg-primary hover:bg-primary/80',
        secondary: 'border-secondary-alt text-secondary-alt bg-secondary hover:bg-secondary/80',
        destructive: 'text-primary-alt border-transparent bg-destructive hover:bg-destructive/80',
        outline: 'text-primary'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
