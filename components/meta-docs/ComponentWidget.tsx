export default function ComponentWidget({name, desc, href, icon: Icon}: {
  name: string;
  desc: string;
  href: string;
  icon: any
}) {
  return (
    <a href={`components/${href}`}>
      <div className="flex flex-col gap-2 min-w-72 h-full bg-primary-dim py-2.5 px-4 rounded-md border border-secondary hover:bg-secondary">
        <div className="flex flex-row items-center gap-2">
          <Icon className="size-4.5"/>
          <span className="text-primary text-lg font-normal align-middle">
          {name}
        </span>
        </div>
        <span className="text-secondary text-sm font-normal align-middle">
          {desc}
        </span>
      </div>
    </a>
  )
}