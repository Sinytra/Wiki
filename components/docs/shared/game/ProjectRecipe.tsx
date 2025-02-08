import {getParams} from "@nimpl/getters/get-params";
import service from "@/lib/service";
import RotatingItemDisplaySlot from "@/components/docs/shared/game/RotatingItemDisplaySlot";
import {GameProjectRecipe, GameRecipeType, RecipeIngredient, RecipeItem, ResolvedItem} from "@/lib/service/types";
import resourceLocation from "@/lib/util/resourceLocation";
import RecipeIngredientDisplay from "@/components/docs/shared/game/RecipeIngredientDisplay";

async function resolveAsset(locale: LocaleFile, slug: string, src: RecipeItem): Promise<ResolvedItem | null> {
  const loc = resourceLocation.parse(src.id);
  const asset = await service.getAsset(slug, src.id, null);
  const name = src.name ? src.name : (loc ? locale[`item.${loc.namespace}.${loc.path}`] || src.id : src.id);
  return !asset ? null : {
    id: src.id,
    src: asset,
    name
  } as ResolvedItem
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

async function resolveAssets(locale: LocaleFile, slug: string, src: RecipeItem[]): Promise<ResolvedItem[]> {
  const res = await Promise.all(src.map(async s => {
    // TODO s.sources
    return resolveAsset(locale, slug, s);
  }));
  return res.filter(s => s !== null);
}

async function RecipeBody({slug, recipe, type}: { slug: string; recipe: GameProjectRecipe, type: GameRecipeType }) {
  const background = await service.getAsset(slug, type.background, null);
  const locale = await getLanguageDefs();

  return (
    <div className="relative shrink-0">
      <img src={background?.src} alt={background?.id} className="sharpRendering min-w-fit"/>

      {...recipe.inputs.map(async (input, i) => {
        const slot = type.inputSlots[input.slot];
        if (!slot) {
          return null;
        }
        const assets = 'tag' in input ? input.tag.items : input.items;
        const resolved = await resolveAssets(locale, slug, assets);
        if (resolved.length < 1) {
          console.error('Failed to resolve', input);
          return null;
        }
        return (
          <RotatingItemDisplaySlot src={resolved} key={i} className="absolute"
                                   style={{left: `${slot.x}px`, top: `${slot.y}px`}}/>
        );
      })}

      {...recipe.outputs.map(async (output, i) => {
        const slot = type.outputSlots[output.slot];
        if (!slot) {
          return null;
        }
        const asset = output.items[0];
        const resolved = await resolveAsset(locale, slug, asset);
        return resolved ? (
          <RotatingItemDisplaySlot src={[resolved]} key={i} className="absolute"
                                   style={{left: `${slot.x}px`, top: `${slot.y}px`}}/>
        ) : null;
      })}
    </div>
  )
}

type IngredientCount = { count: number; item: RecipeItem };

function countOccurrences(ingredients: RecipeIngredient[]): IngredientCount[] {
  let counts: { [key: string]: number } = {};
  ingredients.forEach(ing => {
    if ('tag' in ing) {
      const item = ing.tag.items[0]; // TODO
      counts[item.id] = (counts[item.id] || 0) + ing.count;
    } else {
      const item = ing.items[0];
      counts[item.id] = (counts[item.id] || 0) + item.count;
    }
  });
  return Object.entries(counts)
    .map(([k, v]) => {
      const item = ingredients
        .map(i => 'tag' in i ? i.tag.items[0] : i.items[0])
        .filter(i => i != undefined)
        .find(i => i.id == k);
      return item ? {count: v, item: item} : undefined;
    })
    .filter(i => i != undefined);
}

export default async function ProjectRecipe({id}: { id: string }) {
  const params = getParams() || {};
  const slug = params.slug as any;

  const recipe = await service.getProjectRecipe(slug, id);
  if (!recipe) {
    return null;
  }
  const locale = await getLanguageDefs();
  const inputCounts = countOccurrences(recipe.inputs);
  const outputCounts = countOccurrences(recipe.outputs);

  return (
    <table className="[&_td]:bg-primary-alt/50">
      <thead>
      <tr>
        <th>Recipe Type</th>
        <th>Ingredients</th>
        <th>Outputs</th>
        <th>Recipe preview</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td className="align-middle whitespace-nowrap">
          {recipe.type.localizedName}
        </td>
        <td className="align-top">
          <ul>
            {inputCounts
              .sort((a, b) => b.count - a.count)
              .map(async ({count, item}, index) => {
                const resolved = await resolveAsset(locale, slug, item);
                if (!resolved) {
                  return null; // TODO
                }

                return (
                  <li key={index}>
                    <RecipeIngredientDisplay count={count} item={resolved}/>
                  </li>
                )
              })}
          </ul>
        </td>
        <td className="align-top">
          <ul>
            {outputCounts
              .sort((a, b) => b.count - a.count)
              .map(async ({count, item}, index) => {
                const resolved = await resolveAsset(locale, slug, item);
                if (!resolved) {
                  return null; // TODO
                }

                return (
                  <li key={index}>
                    <RecipeIngredientDisplay count={count} item={resolved}/>
                  </li>
                )
              })}
          </ul>
        </td>
        <td>
          <div className="my-2">
            <RecipeBody slug={slug} recipe={recipe} type={recipe.type}/>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  );
}
