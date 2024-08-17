import Image from "next/image";
import {CopyrightIcon, ExternalLinkIcon, MilestoneIcon, TagIcon, UserIcon} from "lucide-react";
import {getModProjectInformation, ModTagIcons} from "@/components/docs/mod-info/modInfo";
import MutedLinkIconButton from "@/components/ui/muted-link-icon-button";
import LinkTextButton from "@/components/ui/link-text-button";
import MetadataGrid from "@/components/docs/mod-metadata/MetadataGrid";
import MetadataRowKey from "@/components/docs/mod-metadata/MetadataRowKey";
import DocsSidebarTitle from "@/components/docs/layout/DocsSidebarTitle";
import {ModProject} from "@/lib/platforms";

interface Props {
  mod: ModProject;
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
      <DocsSidebarTitle extra={<MutedLinkIconButton icon={ExternalLinkIcon} href={`https://modrinth.com/mod/${mod.slug}`} />}>
        Mod information
      </DocsSidebarTitle>

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