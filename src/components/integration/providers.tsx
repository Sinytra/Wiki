'use client'

import {ReactNode, useEffect} from "react"
import posthog from 'posthog-js'
import {PostHogProvider as PHProvider} from 'posthog-js/react'

export function PostHogProvider({children}: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY != null) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
        person_profiles: 'never',
        defaults: '2025-05-24'
      })
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
