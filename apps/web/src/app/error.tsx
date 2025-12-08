'use client'

import {Button} from "@repo/ui/components/button";
import {ActivityIcon, BugIcon, HouseIcon, ServerCrashIcon} from "lucide-react";
import {useEffect} from "react";
import {NavLink} from "@/components/navigation/link/NavLink";
  
export default function Error({error}: { error: Error & { digest?: string }}) {
  useEffect(() => {
    console.error('Got error', error);
    console.error('Error digest', error.digest);
  }, [error]);

  return (
    <div className="m-auto flex flex-col items-center justify-center gap-4 p-4">
      <ServerCrashIcon className="h-32 w-32 sm:h-48 sm:w-48" strokeWidth={1.5}/>

      <h1 className="my-2 text-3xl text-primary sm:text-5xl">
        Something went wrong
      </h1>

      <p className="w-3/4 text-center text-secondary sm:w-full">
        An error occured while loading the page. Please try again later.
      </p>

      <div className="mt-4 inline-flex flex-wrap justify-center gap-4">
        <Button variant="secondary" asChild>
          <NavLink href="https://status.moddedmc.org" target="_blank">
            <ActivityIcon className="mr-2 h-4 w-4" />
            Check status
          </NavLink>
        </Button>
        <Button asChild>
          <NavLink href="/">
            <HouseIcon className="mr-2 h-4 w-4" />
            Return Home
          </NavLink>
        </Button>
        <Button variant="secondary" asChild>
          <NavLink href="https://github.com/Sinytra/Wiki/issues" target="_blank">
            <BugIcon className="mr-2 h-4 w-4" />
            Report Bug
          </NavLink>
        </Button>
      </div>
    </div>
  )
}
