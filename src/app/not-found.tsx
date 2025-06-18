import {Button} from "@repo/ui/components/button";
import NotFoundImage from '@/components/assets/not-found.jpg';
import Image from "next/image";
import {NavLink} from "@/components/navigation/link/NavLink";
import {HouseIcon} from "lucide-react";

export default function NotFound() {
  return (
    <div className="m-auto flex flex-col items-center justify-center gap-4 p-4">
      {/*Image sourced from https://github.com/httpcats/http.cat, licensed under the MIT License*/}
      <Image src={NotFoundImage} alt="Not Found" className="rounded-xs" width={450}/>

      <h1 className="text-primary my-2 text-5xl">
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