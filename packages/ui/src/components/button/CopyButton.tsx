"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import {cn} from "@repo/ui/lib/utils";
import {Button} from "@repo/ui/components/button";
import {toast} from "sonner";
import {useTranslations} from "next-intl";

export function CopyButton({ text, showToast, className }: { text: string; showToast?: boolean; className?: string }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('CopyButton');

  return (
    <Button variant="ghost" size="icon"
      className={cn(`
        text-secondary-alt opacity-0 transition-opacity duration-200 ease-in-out
        group-hover:opacity-100 hover:bg-gray-400/10 [&>svg]:animate-in [&>svg]:fade-in [&>svg]:fade-out
      `, className)}
      aria-label="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (showToast) {
          toast.success(t('copied'));
        }
      }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </Button>
  )
}