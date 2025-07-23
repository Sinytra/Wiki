import {Pre, RawCode, highlight} from "codehike/code"
import {cn} from "@repo/ui/lib/utils";
import {CopyButton} from "@repo/ui/components/button/CopyButton";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";

function getFileName(meta: string): string | null {
  if (meta.length > 0) {
    const parsedMeta = new RegExp('^title="(?<file>.*)"$').exec(meta);
    return parsedMeta?.groups?.file ?? meta;
  }
  return null;
}

export default async function CodeHikeCode({codeblock}: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, 'github-dark');
  const fileName = getFileName(highlighted.meta);

  return (
    <div className="group relative rounded-sm">
      <div className={cn('absolute', fileName == null ? 'top-1.5 right-1.5 p-1.5' : 'top-1 right-1 p-1')}>
        <ClientLocaleProvider keys={['CopyButton']}>
          <CopyButton text={highlighted.code}/>
        </ClientLocaleProvider>
      </div>
      {fileName &&
        <div className="rounded-sm rounded-b-none bg-code-alt px-2.5 py-1.5 font-mono text-sm text-secondary-alt">
          {fileName}
        </div>
      }
      <Pre className={cn('m-0! rounded-sm', fileName !== null && 'rounded-t-none')} code={highlighted}/>
    </div>
  )
}