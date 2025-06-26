import service from "@/lib/service";
import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import RecipeIngredientDisplay from "@/components/docs/shared/game/RecipeIngredientDisplay";
import {ContentRouteParams} from "@/lib/game/content";
import ResponsiveTable from "@/components/util/ResponsiveTable";
import {getTranslations} from "next-intl/server";
import HoverContextProvider from "@/components/util/HoverContextProvider";
import {DisplayItem, GameRecipeType, ResolvedGameRecipe, ResolvedItem} from "@repo/shared/types/service";
import builtinRecipeTypes from "@/lib/builtin/builtinRecipeTypes";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

interface Properties {
  project: string;
  recipe: ResolvedGameRecipe;
  embedded?: boolean;
  params: ContentRouteParams;
}

async function createDisplayItem(item: ResolvedItem): Promise<DisplayItem> {
  const asset = await service.getAsset(item.project, item.id, null);
  return asset ? {...item, asset} satisfies DisplayItem
    : {...item, asset: {id: item.id, src: 'nonexistent'}} satisfies DisplayItem;
}

async function createDisplayItems(items: ResolvedItem[]): Promise<DisplayItem[]> {
  return Promise.all(items.map(createDisplayItem));
}

async function RecipeBody({slug, recipe, type, params}: {
  slug: string;
  recipe: ResolvedGameRecipe,
  type: GameRecipeType,
  params: ContentRouteParams
}) {
  const background = await service.getAsset(slug, type.background, null);
  const slot = (idx: string, input: boolean) => {
    const slots = input ? type.inputSlots : type.outputSlots;
    return slots[idx];
  };

  return (
    <HoverContextProvider>
      <div className="relative shrink-0">
        <img src={background?.src} alt={background?.id} className="sharpRendering min-w-fit shrink-0"/>

        {...recipe.inputs.map(async (input, i) => {
          const s = slot(input.slot, true);
          const display = await createDisplayItems(input.items);
          return (
            <RotatingItemDisplaySlot src={display} key={i} className="absolute flex shrink-0" params={params}
                                     style={{left: `${s.x}px`, top: `${s.y}px`}} tag={input.tag}/>
          )
        })}

        {...recipe.outputs.map(async (output, i) => {
          const s = slot(output.slot, false);
          const display = await createDisplayItems(output.items);
          return (
            <RotatingItemDisplaySlot src={display} key={i} className="absolute flex shrink-0" count={output.count}
                                     params={params} style={{left: `${s.x}px`, top: `${s.y}px`}} tag={output.tag}/>
          )
        })}
      </div>
    </HoverContextProvider>
  )
}

async function RecipeWorkbenches({workbenches, params}: { workbenches: ResolvedItem[]; params: ContentRouteParams }) {
  const t = await getTranslations('ResolvedProjectRecipe');

  return (
    <div className="py-1 px-2">
      <span className="text-secondary text-xsm">
        {t('workbenches')}
      </span>

      <div className="p-2 flex flex-row gap-2 flex-wrap">
        {...workbenches.map(async (item) => {
          const disp = await createDisplayItem(item);
          return (
            <RotatingItemDisplaySlot src={[disp]} key={item.id} params={params}/>
          )
        })}
      </div>
    </div>
  )
}

export default async function ResolvedProjectRecipe({project, recipe, embedded, params}: Properties) {
  const t = await getTranslations('ResolvedProjectRecipe');

  const recipeType = await service.getRecipeType(project, recipe.type, params.version, params.locale);
  if (!recipeType) {
    return null; // TODO
  }

  const inputCounts = recipe.summary.inputs;
  const outputCounts = recipe.summary.outputs;
  const localizedName = recipeType.type.localizedName || await builtinRecipeTypes.getRecipeTypeName(recipeType.type.id);

  return (
    <div className="[&>table]:mt-0 space-y-2!">
      <ClientLocaleProvider keys={['ResponsiveTable']}>
      <ResponsiveTable
        embedded={embedded}
        expandedBody={recipeType.workbenches.length > 0 &&
          <div>
            <RecipeWorkbenches workbenches={recipeType.workbenches} params={params} />
          </div>
        }
        columns={[
          {key: 'type', label: t('type')},
          {key: 'input', label: t('input')},
          {key: 'output', label: t('output')},
          {key: 'preview', label: t('preview')}
        ]}
        rows={[
          {
            type: {
              className: 'align-middle whitespace-nowrap',
              data: (
                <div className="p-1.5 sm:p-0">
                  {localizedName}
                </div>
              )
            },
            input: {
              className: 'align-top',
              data: (
                <ul className="w-max pl-4">
                  {inputCounts
                    .sort((a, b) => b.count - a.count)
                    .map(async ({count, item, tag}, index) => (
                      <li key={index}>
                        <RecipeIngredientDisplay tag={tag} count={count} item={await createDisplayItem(item)}
                                                 params={params}/>
                      </li>
                    ))}
                </ul>
              )
            },
            output: {
              className: 'align-top',
              data: (
                <ul className="w-max max-w-60 pl-4">
                  {outputCounts
                    .sort((a, b) => b.count - a.count)
                    .map(async ({count, item, tag}, index) => (
                      <li key={index}>
                        <RecipeIngredientDisplay tag={tag} count={count} item={await createDisplayItem(item)}
                                                 params={params}/>
                      </li>
                    ))}
                </ul>
              )
            },
            preview: {
              data: (
                <div className="my-2 w-max p-2 sm:p-0">
                  <RecipeBody slug={project} recipe={recipe} type={recipeType.type} params={params}/>
                </div>
              )
            }
          }
        ]}
      />
      </ClientLocaleProvider>
    </div>
  );
}
