import service from "@/lib/service";
import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import RecipeIngredientDisplay from "@/components/docs/shared/game/RecipeIngredientDisplay";
import {ContentRouteParams} from "@/lib/game/content";
import ResponsiveTable from "@/components/util/ResponsiveTable";
import {getTranslations} from "next-intl/server";
import HoverContextProvider from "@/components/util/HoverContextProvider";
import {DisplayItem, ResolvedGameRecipe, ResolvedItem} from "@repo/shared/types/service";
import builtinRecipeTypes from "@/lib/builtin/builtinRecipeTypes";

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

async function RecipeBody({slug, recipe, params}: {
  slug: string;
  recipe: ResolvedGameRecipe,
  params: ContentRouteParams
}) {
  const background = await service.getAsset(slug, recipe.type.background, null);
  const slot = (idx: string, input: boolean) => {
    const slots = input ? recipe.type.inputSlots : recipe.type.outputSlots;
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

// TODO Handle missing items
export default async function ResolvedProjectRecipe({project, recipe, embedded, params}: Properties) {
  const t = await getTranslations('ResolvedProjectRecipe');

  const inputCounts = recipe.summary.inputs;
  const outputCounts = recipe.summary.outputs;
  const localizedName = recipe.type.localizedName || await builtinRecipeTypes.getRecipeTypeName(recipe.type.id);

  return (
    <ResponsiveTable
      embedded={embedded}
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
                <RecipeBody slug={project} recipe={recipe} params={params}/>
              </div>
            )
          }
        }
      ]}
    />
  );
}
