'use client'

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ServerCrashIcon} from "lucide-react";
import {useEffect} from "react";

export default function Error({error}: { error: Error & { digest?: string }}) {
  useEffect(() => {
    console.error(error);
  }, [error])

  return (
    <div className="m-auto p-4 flex flex-col gap-4 justify-center items-center">
      <ServerCrashIcon className="w-48 h-48" strokeWidth={1.5}/>

      <h1 className="text-foreground text-5xl my-2">
        Something went wrong
      </h1>

      <p className="text-muted-foreground">
        An error occured while loading the page. Please try again later.
      </p>

      <Button asChild className="mt-4">
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  )
}
