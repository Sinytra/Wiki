"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
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
