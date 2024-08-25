import Link from 'next/link'
import {Button} from "@/components/ui/button";
import NotFoundImage from '@/components/assets/not-found.jpg';
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="m-auto p-4 flex flex-col gap-4 justify-center items-center">
      {/*Image sourced from https://github.com/httpcats/http.cat, licensed under the MIT License*/}
      <Image src={NotFoundImage} alt="Not Found" className="rounded-sm" width={450}/>

      <h1 className="text-foreground text-5xl my-2">
        404 Not Found
      </h1>

      <p className="text-muted-foreground">Whoops! Could not find the requested resource.</p>

      <Button asChild className="mt-4">
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  )
}