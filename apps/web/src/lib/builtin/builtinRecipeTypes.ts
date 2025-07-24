import {getTranslations} from "next-intl/server";
import resourceLocation, {DEFAULT_NAMESPACE} from "@repo/shared/resourceLocation";

async function getRecipeTypeName(id: string): Promise<string | null> {
  const loc = resourceLocation.parse(id);
  if (!loc || loc.namespace != DEFAULT_NAMESPACE) {
    return null;
  }

  const t = await getTranslations('BuiltinRecipeTypes');
  return t(loc.path as any);
}

export default {
  getRecipeTypeName
}