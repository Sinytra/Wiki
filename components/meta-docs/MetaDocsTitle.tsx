import {Project} from "@/lib/service";

interface Props {
  project?: Project;
  children?: any;
}

export default function MetaDocsTitle({ children }: Props) {
  return (
    <div className="not-prose pt-2">
      <div className="flex flex-row flex-wrap justify-between gap-2 md:flex-nowrap md:items-end">
        <h1 className="text-2xl text-ellipsis text-primary md:overflow-hidden md:whitespace-nowrap">
          {children}
        </h1>
      </div>
      <hr className="mt-2 mb-6 border-neutral-600"/>
    </div>
  )
}