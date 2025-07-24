import {ReactNode} from "react";

export default function LandingStarterBase({icon: Icon, title, desc, children}: {
  icon: any,
  title: string,
  desc: ReactNode,
  children?: any
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-6">
      <div className="inline-flex items-center gap-2">
        <Icon className="size-8" strokeWidth={1.5}/>
        <span className="text-2xl">{title}</span>
      </div>

      <div className="flex h-full flex-col items-center justify-evenly">
        {desc}
      </div>

      {children}
    </div>
  )
}