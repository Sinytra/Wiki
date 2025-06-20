'use client'

import {format} from "date-fns";

export default function LocalDateTime({ className, dateTime, form }: { className?: string; dateTime: Date; form?: string }) {
  return (
    <time className={className} dateTime={dateTime.toISOString()} suppressHydrationWarning>
      {format(dateTime, form ?? 'yyyy-MM-dd HH:mm')}
    </time>
  )
}