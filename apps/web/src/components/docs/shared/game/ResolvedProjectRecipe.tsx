import service from "@/lib/service";
import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import RecipeIngredientDisplay from "@/components/docs/shared/game/RecipeIngredientDisplay";
import ResponsiveTable from "@/components/util/ResponsiveTable";
import {getTranslations} from "next-intl/server";
import HoverContextProvider from "@/components/util/HoverContextProvider";
import {
  DisplayItem,
  GameRecipeType,
  ProjectContext,
  ResolvedGameRecipe,
  ResolvedItem
} from "@repo/shared/types/service";
import builtinRecipeTypes from "@/lib/builtin/builtinRecipeTypes";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

interface Properties {
  recipe: ResolvedGameRecipe;
  embedded?: boolean;
  ctx: ProjectContext;
}

async function createDisplayItem(item: ResolvedItem): Promise<DisplayItem> {
  const asset = await service.getAsset(item.id, { id: item.project });
  return asset ? {...item, asset} satisfies DisplayItem
    : {...item, asset: {id: item.id, src: 'nonexistent'}} satisfies DisplayItem;
}

async function createDisplayItems(items: ResolvedItem[]): Promise<DisplayItem[]> {
  return Promise.all(items.map(createDisplayItem));
}

async function RecipeBody({recipe, type, ctx}: {
  recipe: ResolvedGameRecipe,
  type: GameRecipeType,
  ctx: ProjectContext
}) {
  const background = await service.getAsset(type.background, ctx);
  const slot = (key: string, input: boolean) => {
    const slots = input ? type.inputSlots : type.outputSlots;
    const result = slots[key];
    if (!result) {
      console.error(`Missing recipe slot for recipe "${recipe.id}", key "${key}", input: ${input}`)
    }
    return result;
  };

  return (
    <HoverContextProvider>
      <div className="relative shrink-0">
        <img src={background?.src} alt={background?.id} className="sharpRendering min-w-fit shrink-0"/>

        {...recipe.inputs.map(async (input, i) => {
          const s = slot(input.slot, true);
          if (!s) return null;

          const display = await createDisplayItems(input.items);
          return (
            <RotatingItemDisplaySlot src={display} key={i} className="absolute flex shrink-0" ctx={ctx}
                                     style={{left: `${s.x}px`, top: `${s.y}px`}} tag={input.tag}/>
          )
        })}

        {...recipe.outputs.map(async (output, i) => {
          const s = slot(output.slot, false);
          if (!s) return null;

          const display = await createDisplayItems(output.items);
          return (
            <RotatingItemDisplaySlot src={display} key={i} className="absolute flex shrink-0" count={output.count}
                                     ctx={ctx} style={{left: `${s.x}px`, top: `${s.y}px`}} tag={output.tag}/>
          )
        })}
      </div>
    </HoverContextProvider>
  )
}

async function RecipeWorkbenches({workbenches, ctx}: { workbenches: ResolvedItem[]; ctx: ProjectContext }) {
  const t = await getTranslations('ResolvedProjectRecipe');

  return (
    <div className="px-2 py-1">
      <span className="text-xsm text-secondary">
        {t('workbenches')}
      </span>

      <div className="flex flex-row flex-wrap gap-2 p-2">
        {...workbenches.map(async (item) => {
          const disp = await createDisplayItem(item);
          return (
            <RotatingItemDisplaySlot src={[disp]} key={item.id} ctx={ctx}/>
          )
        })}
      </div>
    </div>
  )
}

export default async function ResolvedProjectRecipe({recipe, embedded, ctx}: Properties) {
  const t = await getTranslations('ResolvedProjectRecipe');

  const recipeType = await service.getRecipeType(recipe.type, ctx);
  if (!recipeType) {
    return null; // TODO
  }

  const inputCounts = recipe.summary.inputs;
  const outputCounts = recipe.summary.outputs;
  const localizedName = recipeType.type.localizedName || await builtinRecipeTypes.getRecipeTypeName(recipeType.type.id);

  return (
    <div className="space-y-2! [&>table]:mt-0">
      <ClientLocaleProvider keys={['ResponsiveTable']}>
      <ResponsiveTable
        embedded={embedded}
        expandedBody={recipeType.workbenches.length > 0 &&
          <div>
            <RecipeWorkbenches workbenches={recipeType.workbenches} ctx={ctx} />
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
                <div className="p-1.5 text-center sm:p-0">
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
                                                 ctx={ctx}/>
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
                                                 ctx={ctx}/>
                      </li>
                    ))}
                </ul>
              )
            },
            preview: {
              data: (
                <div className="my-2 w-max p-2 sm:p-0">
                  <RecipeBody recipe={recipe} type={recipeType.type} ctx={ctx}/>
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
