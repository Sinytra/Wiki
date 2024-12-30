import {Project} from "@/lib/service";

interface Props {
  project?: Project;
  children?: any;
}

export default function MetaDocsTitle({ children }: Props) {
  return (
    <div className="not-prose pt-2">
      <div className="flex flex-row flex-wrap md:flex-nowrap justify-between md:items-end gap-2">
        <h1 className="text-ellipsis md:overflow-hidden md:whitespace-nowrap text-foreground text-2xl">
          {children}
        </h1>
      </div>
      <hr className="mt-2 mb-6 border-neutral-600"/>
    </div>
  )
}