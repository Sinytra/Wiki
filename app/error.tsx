'use client'

import {Button} from "@/components/ui/button";
import {BugIcon, ServerCrashIcon} from "lucide-react";
import {useEffect} from "react";
import {NavLink} from "@/components/navigation/link/NavLink";
import Link from "next/link";
  
export default function Error({error}: { error: Error & { digest?: string }}) {
  useEffect(() => {
    console.error(error);
    console.error('Error digest', error.digest);
  }, [error]);

  return (
    <div className="m-auto p-4 flex flex-col gap-4 justify-center items-center">
      <ServerCrashIcon className="w-32 h-32 sm:w-48 sm:h-48" strokeWidth={1.5}/>

      <h1 className="text-foreground text-3xl sm:text-5xl my-2">
        Something went wrong
      </h1>

      <p className="text-muted-foreground text-center w-3/4 sm:w-full">
        An error occured while loading the page. Please try again later.
      </p>

      <div className="inline-flex gap-4 mt-4">
        <Button variant="secondary" asChild>
          <Link href="https://github.com/Sinytra/Wiki/issues" target="_blank">
            <BugIcon className="mr-2 w-4 h-4" />
            Report Bug
          </Link>
        </Button>
        <Button asChild>
          <NavLink href="/">
            Return Home
          </NavLink>
        </Button>
      </div>
    </div>
  )
}
