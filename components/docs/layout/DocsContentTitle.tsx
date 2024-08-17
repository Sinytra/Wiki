import {Badge} from "@/components/ui/badge";

export default function DocsContentTitle({ isLocal, children }: { isLocal?: boolean, children?: any }) {
  return (
    <div className="not-prose">
      <div className="flex flex-row justify-between items-end">
        <h1 className="text-foreground text-2xl">
          {children}
        </h1>
        {isLocal && <Badge variant="destructive">Local</Badge>}
      </div>
      <hr className="mt-4 mb-6 border-neutral-600"/>
    </div>
  )
}