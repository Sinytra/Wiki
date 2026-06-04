import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@repo/ui/lib/utils';

const badgeVariants = cva(
  `inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden`,
  {
    variants: {
      variant: {
        project: 'border-info bg-secondary text-secondary-alt hover:bg-secondary/80',
        documentation: 'border-secondary-alt bg-secondary text-secondary-alt hover:bg-secondary/80',
        content: 'border-warning bg-secondary text-secondary-alt hover:bg-secondary/80'
      }
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export default function SearchResultBadge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
