import {Pre, RawCode, highlight} from "codehike/code"
import {CopyButton} from "@/components/util/CopyButton";
import {cn} from "@/lib/utils";

function getFileName(meta: string): string | null {
  if (meta.length > 0) {
    const parsedMeta = new RegExp('^title="(?<file>.*)"$').exec(meta);
    return parsedMeta?.groups?.file ?? meta;
  }
  return null;
}

export default async function CodeHikeCode({codeblock}: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark");
  const fileName = getFileName(highlighted.meta);

  return (
    <div className="rounded-xs bg-zinc-950 relative group">
      <CopyButton text={highlighted.code} offset={fileName == null}/>
      {fileName &&
        <div
          className="text-secondary-foreground px-2.5 py-1.5 text-sm font-mono bg-[#2b313a] rounded-xs rounded-b-none">
          {fileName}
        </div>
      }
      <Pre className={cn('m-0 bg-zinc-950 rounded-xs', fileName !== null && 'rounded-t-none')} code={highlighted}/>
    </div>
  )
}