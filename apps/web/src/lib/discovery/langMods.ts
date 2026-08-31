import { getProcessURL } from '@/lib/utils';

export interface ModelLink {
  title: string;
  url: string;
  desc?: string | null;
}

export interface ModelSection {
  title: string;
  body?: string | null;
  links?: ModelLink[];
}

export interface ModelDocument {
  title: string;
  summary: string;
  details?: string | null;
  sections: ModelSection[];
}

export function absoluteUrl(path: string): string {
  return new URL(path, getProcessURL()).toString();
}

function renderLink({ title, url, desc }: ModelLink): string {
  return `- [${title}](${url})${desc ? `: ${desc}` : ''}`;
}

function renderSection({ title, body, links }: ModelSection): string {
  const parts = [`## ${title}`];
  if (body) {
    parts.push(body.trim());
  }
  if (links && links.length > 0) {
    parts.push(links.map(renderLink).join('\n'));
  }
  return parts.join('\n\n');
}

export function renderLanguageModelsTxt({ title, summary, details, sections }: ModelDocument): string {
  const parts = [`# ${title}`, `> ${summary.trim().replace(/\n+/g, ' ')}`];
  if (details) {
    parts.push(details.trim());
  }
  sections.filter((s) => s.body || (s.links && s.links.length > 0)).forEach((s) => parts.push(renderSection(s)));

  return parts.join('\n\n') + '\n';
}
