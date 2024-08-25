'use client'

import {format} from "date-fns";

export default function LocalDateTime({ dateTime }: { dateTime: Date }) {
  return (
    <time dateTime={dateTime.toISOString()} suppressHydrationWarning>{format(dateTime, 'yyyy-MM-dd HH:mm')}</time>
  )
}