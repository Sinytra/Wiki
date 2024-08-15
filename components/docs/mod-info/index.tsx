import {ModrinthProject} from "@/lib/modrinth";
import Image from "next/image";
import {CopyrightIcon, ExternalLinkIcon, MilestoneIcon, TagIcon, UserIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {getModProjectInformation, ModTagIcons} from "@/components/docs/mod-info/modInfo";
import SidebarTitle from "@/components/docs/sidebar-title";
import MutedLinkIconButton from "@/components/ui/muted-link-icon-button";

interface Props {
  mod: ModrinthProject;
}

function IconRow({icon: Icon, children}: { icon: any, children: any }) {
  return (
    <div className="inline-flex items-center whitespace-nowrap gap-2">
      <Icon className="w-4 h-4"/>
      <span className="font-medium text-foreground">{children}</span>
    </div>
  )
}

function ModTags({tags}: { tags: string[] }) {
  return (
    <div className="flex flex-row items-center justify-end gap-2">
      {tags.filter(t => ModTagIcons[t] !== undefined).map(tag => {
        const Component = ModTagIcons[tag];
        return <Component className="w-4 h-4" key={tag}/>;
      })}
    </div>
  );
}

export default async function ModInfo({mod}: Props) {
  const info = await getModProjectInformation(mod);

  return (
    <div className="flex flex-col">
      <SidebarTitle extra={<MutedLinkIconButton icon={ExternalLinkIcon} href={`https://modrinth.com/mod/${mod.slug}`} />}>
        Mod information
      </SidebarTitle>

      <div className="mb-6 border border-accent m-2">
        <Image className="m-4 mx-auto rounded-sm" src={mod.icon_url} alt="Logo" width={128} height={128}/>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-center font-medium text-lg">{mod.name}</span>
        <span className="text-sm text-muted-foreground text-center">{mod.summary}</span>
      </div>

      <div className="mx-1 mt-4">
        <div
          className="w-full grid grid-flow-row gap-y-3 text-sm [&>div]:inline-flex [&>div]:items-start [&>div]:justify-between [&_div:last-child]:font-light [&>div:last-child]:text-end">
          <div>
            <IconRow icon={UserIcon}>Author</IconRow>
            <div className="myItems flex flex-row flex-wrap justify-end">
              {info.authors.map((a, i) => (
                <div>
                  <Button key={a.name} variant="link" asChild className="p-0 h-fit font-light text-foreground">
                    <Link href={a.url} target="_blank">{a.name}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <IconRow icon={TagIcon}>Tags</IconRow>
            <div>
              <ModTags tags={mod.categories}/>
            </div>
          </div>
          <div>
            <IconRow icon={MilestoneIcon}>Latest version</IconRow>
            <div>{info.latest_version}</div>
          </div>
          <div>
            <IconRow icon={CopyrightIcon}>License</IconRow>
            {mod.license.url
              ?
              <Button variant="link" asChild className="p-0 h-fit font-light text-foreground">
                <Link href={mod.license.url} target="_blank">{info.license.name}</Link>
              </Button>
              :
              <div>{info.license.name}</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}