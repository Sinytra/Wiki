import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {cn} from "@repo/ui/lib/utils";

const buttonVariants = cva(
  `
    inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background
    transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
    focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        default: "border border-primary bg-primary text-primary hover:bg-secondary/90",
        destructive:
          "bg-secondary text-destructive hover:text-destructive/90",
        outline:
          "border border-quaternary bg-primary hover:bg-secondary hover:text-primary-alt",
        secondary:
          "bg-secondary text-secondary-alt hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-primary-alt",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
