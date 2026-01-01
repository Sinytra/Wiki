import {FileBracesCornerIcon} from 'lucide-react';
import {useMDXComponents} from 'nextra-theme-docs';

export default function FormatHeader({schema, children}: { schema: string, children: any }) {
  const {h2: H2} = useMDXComponents();
  return (
    <H2 className="flex items-center justify-between gap-4">
      {children}
      <a className="hover:bg-neutral-800 p-1.5 rounded-sm"
         href={`https://api.moddedmc.wiki/static/schemas/${schema}.schema.json`}
         target="_blank" rel="noreferrer"
      >
        <FileBracesCornerIcon className="size-4.5" />
      </a>
    </H2>
  );
}