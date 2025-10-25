import {Button} from "@repo/ui/components/button";
import {NavLink} from "@/components/navigation/link/NavLink";
import {HouseIcon, TelescopeIcon} from "lucide-react";

export default function NotFound() {
  return (
    <div className="m-auto flex flex-col items-center justify-center gap-4 p-4">
      <TelescopeIcon className="size-32 rounded-xs opacity-100"/>

      <h1 className="my-2 text-5xl text-primary">
        404 Not Found
      </h1>

      <p className="text-secondary">Whoops! Could not find the requested resource.</p>

      <Button asChild className="mt-4">
        <NavLink href="/">
          <HouseIcon className="mr-2 h-4 w-4" />
          Return Home
        </NavLink>
      </Button>
    </div>
  )
}