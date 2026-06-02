import DocsSidebarBase from '@/components/docs/side/DocsSidebarBase';
import {cn} from '@repo/ui/lib/utils';
import service from '@/lib/service';
import ImageWithFallback from '@/components/util/ImageWithFallback';
import {getTranslations} from 'next-intl/server';
import {Frontmatter} from '@sinytra/wiki-api-types';
import {ProjectContext} from '@repo/shared/types/service';

interface ContentRightSidebarProps {
  frontmatter: Frontmatter;
  ctx: ProjectContext;
}

export default async function DocsGuideContentRightSidebar({frontmatter, ctx}: ContentRightSidebarProps) {
  const t = await getTranslations('DocsContentRightSidebar');
  const iconUrl = frontmatter.icon != null ? await service.getAsset(frontmatter.icon, ctx) : null;

  return (
    <DocsSidebarBase
      type="right"
      title={t('title')}
      className={cn(
        'right-0 shrink-0',
        'w-[96vw] sm:w-64'
      )}
    >
      <div className="space-y-2 sm:w-56">
        <div className="m-2 mb-6 rounded-xs border border-tertiary">
          <ImageWithFallback src={iconUrl?.src} width={128} height={128} className={`
            docsContentIcon disable-blur m-4 mx-auto
          `}
                             alt={!iconUrl ? undefined : iconUrl.id}/>
        </div>
        {frontmatter.title &&
          <h1 className="text-primarys text-center text-lg font-semibold">
            {frontmatter.title}
          </h1>
        }
      </div>
    </DocsSidebarBase>
  );
}