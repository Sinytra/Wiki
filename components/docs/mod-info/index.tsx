import {ModrinthProject} from "@/lib/modrinth";
import Image from "next/image";
import {CopyrightIcon, ExternalLinkIcon, MilestoneIcon, TagIcon, UserIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {getModProjectInformation, ModTagIcons} from "@/components/docs/mod-info/modInfo";
import SidebarTitle from "@/components/docs/sidebar-title";
import MutedLinkIconButton from "@/components/ui/muted-link-icon-button";
import LinkTextButton from "@/components/ui/link-text-button";
import MetadataGrid from "@/components/docs/mod-metadata/MetadataGrid";
import MetadataRowKey from "@/components/docs/mod-metadata/MetadataRowKey";

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

      <div className="mb-6 border border-accent m-2 rounded-sm">
        <Image className="m-4 mx-auto rounded-sm" src={mod.icon_url} alt="Logo" width={128} height={128}/>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-center font-medium text-lg">{mod.name}</span>
        <span className="text-sm text-muted-foreground text-center">{mod.summary}</span>
      </div>

      <div className="mx-1 mt-6">
        <MetadataGrid>
          <MetadataRowKey icon={UserIcon} title="Author">
            <div className="myItems flex flex-row flex-wrap justify-end">
              {info.authors.map((a, i) => (
                <div key={a.name}>
                  <LinkTextButton href={a.url} target="_blank">{a.name}</LinkTextButton>
                </div>
              ))}
            </div>
          </MetadataRowKey>
          <MetadataRowKey icon={TagIcon} title="Tags">
            <ModTags tags={mod.categories}/>
          </MetadataRowKey>
          <MetadataRowKey icon={MilestoneIcon} title="Latest version">
            {info.latest_version}
          </MetadataRowKey>
          <MetadataRowKey icon={CopyrightIcon} title="License">
            {mod.license.url
              ?
              <LinkTextButton href={mod.license.url}>{info.license.name}</LinkTextButton>
              :
              <>{info.license.name}</>
            }
          </MetadataRowKey>
        </MetadataGrid>
      </div>
    </div>
  )
}