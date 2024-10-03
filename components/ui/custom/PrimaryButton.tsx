import {Button, ButtonProps} from "@/components/ui/button";
import * as React from "react";
import {ReactNode} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const primaryButtonVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "!border-foreground",
        muted: "!border-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function PrimaryButton({children, className, variant, ...props}: Omit<ButtonProps, 'variant'> & VariantProps<typeof primaryButtonVariants> & { children?: ReactNode }) {
  return (
    <Button variant="outline" className={cn(primaryButtonVariants({ variant, className }))} {...props}>
      {children}
    </Button>
  )
}