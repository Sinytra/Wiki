import UsageContentList from "@/components/docs/shared/game/UsageContentList";
import PageLink from "@/components/docs/PageLink";
import {getContentLink} from "@/lib/game/content";
import service from "@/lib/service";
import {getProjectParams} from "@/lib/utils";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {getTranslations} from "next-intl/server";
import ItemAsset from "@/components/docs/shared/asset/ItemAsset";

export default async function RecipeUsage({id}: { id: string }) {
  const t = await getTranslations('RecipeUsage');
  const params = getProjectParams();
  const ctx = {id: params.slug, version: params.version, locale: params.locale};

  const usage = await service.getContentRecipeUsage(id, ctx);
  if (!usage) {
    return null;
  }

  const sorted = usage.sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
  const rendered = sorted.map(item => {
    const Wrapper = ({children}: {children: any}) => item.has_page
      ? <PageLink href={getContentLink(params as any, item.id)}>{children}</PageLink>
      : <div>{children}</div>

    return (
      <li key={item.id} className="first:mt-0">
        <Wrapper>
          <div className="inline-flex">
            <ItemAsset project={item.project} location={item.id} className="mr-1.5!"/>
          </div>
          <span>{item.name || item.id}</span>
        </Wrapper>
      </li>
    );
  });

  return (
    <div className="flex flex-col gap-3">
      <span>
        {t('description')}
      </span>

      <div className="columns-[20em]">
        <ClientLocaleProvider keys={['UsageContentList']}>
          <UsageContentList limit={12} content={rendered}/>
        </ClientLocaleProvider>
      </div>
    </div>
  )
}