export default function ComponentWidget({name, desc, href, icon: Icon}: {
  name: string;
  desc: string;
  href: string;
  icon: any
}) {
  return (
    <a href={`components/${href}`}>
      <div className={`
        flex h-full min-w-72 flex-col gap-2 rounded-md border border-secondary bg-primary-dim px-4 py-2.5
        hover:bg-secondary
      `}>
        <div className="flex flex-row items-center gap-2">
          <Icon className="size-4.5"/>
          <span className="align-middle text-lg font-normal text-primary">
          {name}
        </span>
        </div>
        <span className="align-middle text-sm font-normal text-secondary">
          {desc}
        </span>
      </div>
    </a>
  )
}