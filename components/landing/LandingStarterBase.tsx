import {ReactNode} from "react";

export default function LandingStarterBase({icon: Icon, title, desc, children}: {
  icon: any,
  title: string,
  desc: ReactNode,
  children?: any
}) {
  return (
    <div className="flex flex-col gap-6 justify-between items-center">
      <div className="inline-flex gap-2 items-center">
        <Icon className="size-8" strokeWidth={1.5}/>
        <span className="text-2xl">{title}</span>
      </div>

      <div className="flex flex-col justify-evenly h-full items-center">
        {desc}
      </div>

      {children}
    </div>
  )
}