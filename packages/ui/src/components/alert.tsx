import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {cn} from "@repo/ui/lib/utils";

const alertVariants = cva(
  `
    relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:text-primary
    [&>svg]:rtl:right-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7 [&>svg~*]:rtl:pr-7
  `,
  {
    variants: {
      variant: {
        default: "border-[var(--callout-border)] bg-primary-alt text-primary",
        destructive: "border-destructive text-[var(--destructive-bright)] [&>svg]:text-destructive",
        warning: "border-warning text-warning [&>svg]:text-warning",
        info: "border-blue-400/50 text-blue-300/90 [&>svg]:text-blue-300"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 leading-none font-medium tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
