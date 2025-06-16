import resourceLocation from "@repo/shared/resourceLocation";
import service from "@/lib/service";
import builtinRecipeTypes from "@/lib/builtin/builtinRecipeTypes";
import {GameProjectRecipe, GameRecipeType, RecipeItem, ResolvedItem, Slot} from "@repo/shared/types/service";

export interface ResolvedSlotItem {
  slot: Slot;
  items: ResolvedItem[];
  count: number;
}

export interface ResolvedRecipe {
  type: GameRecipeType;
  inputs: ResolvedSlotItem[];
  outputs: ResolvedSlotItem[];
}

type LocaleFile = Record<string, string>;

async function getLanguageDefs(): Promise<LocaleFile> {
  const locale = 'en_us'; // TODO
  const resp = await fetch(process.env.BUILTIN_LOCALE_SOURCES + locale + '.json', {
    next: {
      tags: ['locale'],
      revalidate: 9999999
    }
  });
  return resp.json();
}

async function resolveAsset(locale: LocaleFile, src: RecipeItem): Promise<ResolvedItem[] | null> {
  const sources = src.sources.length > 0 ? src.sources : [null];

  const resolved = (await Promise.all(
    sources.map(async source => {
      const loc = resourceLocation.parse(src.id);
      const asset = await service.getAsset(source, src.id, null);
      const name = src.name ? src.name : (loc ? locale[`item.${loc.namespace}.${loc.path}`] || src.id : src.id);
      return !asset ? null : {
        id: src.id,
        src: asset,
        name,
        project: source,
        has_page: src.has_page
      } satisfies ResolvedItem
    })
  )).filter(s => s != null);

  return resolved.length > 0 ? resolved : null;
}

async function resolveAssets(locale: LocaleFile, src: RecipeItem[]): Promise<ResolvedItem[]> {
  const res = await Promise.all(src.map(async s => resolveAsset(locale, s)));
  return res.filter(s => s !== null).flatMap(a => a);
}

async function resolveRecipe(recipe: GameProjectRecipe): Promise<ResolvedRecipe> {
  const locale = await getLanguageDefs();

  const inputs: ResolvedSlotItem[] = (await Promise.all(
    recipe.inputs.map(async (input, i) => {
      const slot = recipe.type.inputSlots[input.slot];
      if (!slot) {
        return null;
      }

      const items = 'tag' in input ? input.tag.items : input.items;
      const count = 'tag' in input ? input.count : 1;
      const resolved = await resolveAssets(locale, items);
      if (resolved.length < 1) {
        console.error('Failed to resolve', input);
        return null;
      }
      return { items: resolved, slot, count } satisfies ResolvedSlotItem;
    })
  )).filter(s => s != null).flatMap(a => a);

  const outputs: ResolvedSlotItem[] = (await Promise.all(
    recipe.outputs.map(async (output, i) => {
      const slot = recipe.type.outputSlots[output.slot];
      if (!slot) {
        return null;
      }
      const item = output.items[0]; // TODO ??
      const count = item.count; // TODO ?
      const res = await resolveAsset(locale, item);
      return res ? { items: res, slot, count } satisfies ResolvedSlotItem: null;
    })
  )).filter(s => s != null).flatMap(a => a);

  return {inputs, outputs, type: recipe.type};
}

async function processRecipe(recipe: GameProjectRecipe): Promise<GameProjectRecipe> {
  if (recipe && !recipe.type.localizedName) {
    const name = await builtinRecipeTypes.getRecipeTypeName(recipe.type.id);
    if (name) {
      return {...recipe, type: {...recipe.type, localizedName: name} };
    }
  }
  return recipe;
}

export default {
  processRecipe,
  resolveRecipe
}