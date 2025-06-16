"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import {cn} from "@/lib/utils";

export function CopyButton({ text, offset }: { text: string; offset?: boolean }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className={cn(`
        absolute rounded-sm text-secondary-alt opacity-0 transition-opacity duration-200 ease-in-out
        group-hover:opacity-100 hover:bg-gray-400/20
      `, offset ? `top-1.5 right-1.5 p-1.5` : `top-1 right-1 p-1`)}
      aria-label="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}