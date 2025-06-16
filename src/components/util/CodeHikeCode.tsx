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
    <div className="group relative rounded-sm">
      <CopyButton text={highlighted.code} offset={fileName == null}/>
      {fileName &&
        <div className="rounded-sm rounded-b-none bg-code-alt px-2.5 py-1.5 font-mono text-sm text-secondary-alt">
          {fileName}
        </div>
      }
      <Pre className={cn('m-0! rounded-sm', fileName !== null && 'rounded-t-none')} code={highlighted}/>
    </div>
  )
}