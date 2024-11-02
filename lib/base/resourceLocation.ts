import {ResourceLocation} from "@/lib/base/assets";

function toString(location: ResourceLocation): string {
  return `${location.namespace}:${location.path}`;
}

function parse(loc: string): ResourceLocation | null {
  if (loc.length === 0) {
    return null;
  }
  if (loc.includes(':')) {
    const parts = loc.split(':');
    return {namespace: parts[0], path: parts[1]};
  }
  return {namespace: 'minecraft', path: loc};
}

export default {
  toString,
  parse
}
