'use client'

import {useEffect} from 'react'
import DocsPageNotFoundError from "@/components/docs/DocsPageNotFoundError";

export default function Error({error}: { error: Error & { digest?: string } }) {
  useEffect(() => console.error(error), [error]);

  return (
    <div className="mt-40 flex flex-col items-center">
      <DocsPageNotFoundError />
    </div>
  )
}