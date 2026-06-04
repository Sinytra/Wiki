import { ItemProperties } from '@repo/shared/types/service';
import { JsonValue } from '@sinytra/wiki-api-types';
import { JSX } from 'react';

export type PropertyValue = JsonValue | JSX.Element;

export interface SingleProperty {
  type: 'single';
  value: PropertyValue;
  order?: number;
}

export interface PropertyGroup {
  type: 'group';
  value: PropertyGroupItem[];
  order?: number;
}

export interface PropertyGroupItem {
  items: string[];
  value: PropertyValue;
}

export type ResolvedItemProperty = SingleProperty | PropertyGroup;

export type ResolvedItemProperties = { [key in string]: ResolvedItemProperty };

export function resolveItemProperties(props: ItemProperties): ResolvedItemProperties {
  const result: ResolvedItemProperties = {};

  const byProperty = new Map<string, { itemId: string; value: JsonValue }[]>();

  for (const [itemId, properties] of Object.entries(props)) {
    for (const [propName, value] of Object.entries(properties)) {
      let entries = byProperty.get(propName);
      if (!entries) {
        entries = [];
        byProperty.set(propName, entries);
      }
      entries.push({ itemId, value });
    }
  }

  for (const [propName, entries] of byProperty) {
    const groups: PropertyGroupItem[] = [];
    const groupByKey = new Map<string, PropertyGroupItem>();

    for (const { itemId, value } of entries) {
      const key = stableKey(value);
      let group = groupByKey.get(key);
      if (!group) {
        group = { items: [], value };
        groupByKey.set(key, group);
        groups.push(group);
      }
      group.items.push(itemId);
    }

    result[propName] =
      groups?.[0] && groups.length === 1
        ? { type: 'single', value: groups[0].value }
        : { type: 'group', value: groups };
  }

  return result;
}

function stableKey(value: JsonValue): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableKey).join(',')}]`;
  }
  return `{${Object.keys(value)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableKey(value[k]!)}`)
    .join(',')}}`;
}
