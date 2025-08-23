import UsageContentList from "@/components/docs/shared/game/UsageContentList";
import PageLink from "@/components/docs/PageLink";
import {getContentLink} from "@/lib/game/content";
import service from "@/lib/service";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {getTranslations} from "next-intl/server";
import ItemAsset from "@/components/docs/shared/asset/ItemAsset";
import {ProjectContext} from "@repo/shared/types/service";
import env from "@repo/shared/env";
import InteractiveComponentPlaceholder from "@/components/docs/InteractiveComponentPlaceholder";

interface Props {
  id: string;
  ctx: ProjectContext;
}

export async function BindableRecipeUsage(ctx: ProjectContext, props: Omit<Props, 'ctx'>) {
  return RecipeUsage({...props, ctx});
}

export default async function RecipeUsage({id, ctx}: Props) {
  const t = await getTranslations('RecipeUsage');

  if (env.isPreview()) {
    return <InteractiveComponentPlaceholder />;
  }

  const usage = await service.getContentRecipeUsage(id, ctx);
  if (!usage) {
    return null;
  }

  const sorted = usage.sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
  const rendered = sorted.map(item => {
    const Wrapper = ({children}: {children: any}) => item.has_page
      ? <PageLink href={getContentLink(ctx, item.id)}>{children}</PageLink>
      : <div>{children}</div>

    return (
      <li key={item.id} className="first:mt-0">
        <Wrapper>
          <div className="inline-flex">
            <ItemAsset location={item.id} ctx={ctx} className="mr-1.5!"/>
          </div>
          <span>{item.name || item.id}</span>
        </Wrapper>
      </li>
    );
  });

  return (
    <div className="flex flex-col gap-3">
      <span>
        {t(rendered.length > 0 ? 'description' : 'empty')}
      </span>

      <div className="columns-[20em]">
        <ClientLocaleProvider keys={['UsageContentList']}>
          <UsageContentList limit={12} content={rendered}/>
        </ClientLocaleProvider>
      </div>
    </div>
  )
}