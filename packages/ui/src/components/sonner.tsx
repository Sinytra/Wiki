"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-primary group-[.toaster]:text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-secondary",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-inverse",
          cancelButton:
            "group-[.toast]:bg-primary-alt group-[.toast]:text-secondary",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
