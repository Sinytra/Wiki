import {ModrinthProject} from "@/lib/modrinth";
import Image from "next/image";
import {ExternalLinkIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface Props {
  mod: ModrinthProject;
}

export default function ModInfo({mod}: Props) {
  return (
    <div className="flex flex-col">
      <div>
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-foreground text-lg">Mod information</h1>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Link href={`https://modrinth.com/mod/${mod.slug}`} target="_blank">
              <ExternalLinkIcon className="w-5 h-5" />
            </Link>
          </Button>
        </div>
        <hr className="mt-2 border-neutral-600"/>
      </div>

      <div className="my-6 border border-accent rounded-md m-2">
        <Image className="m-4 mx-auto" src={mod.icon_url} alt="Logo" width={128} height={128}/>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-center font-medium text-lg">{mod.name}</span>
        <span className="text-sm text-muted-foreground text-center">{mod.summary}</span>
      </div>
    </div>
  )
}