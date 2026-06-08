import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/ui/lib/utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center rounded-sm text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: 'border border-primary bg-primary text-primary hover:bg-secondary/90',
        destructive:
          'border-destructive-secondary border bg-primary bg-secondary font-semibold text-destructive hover:bg-secondary/80 hover:text-destructive/90 data-[pending=true]:text-destructive/90',
        destructiveSecondary: 'text-primary-alt hover:text-primary-alt/90 bg-destructive',
        outline: 'border-quaternary hover:text-primary-alt border bg-primary hover:bg-secondary',
        secondary: 'text-secondary-alt bg-secondary hover:bg-secondary/80',
        ghost: 'hover:text-primary-alt hover:bg-secondary',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-sm px-3',
        lg: 'h-11 rounded-sm px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
