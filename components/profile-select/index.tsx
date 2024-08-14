'use client'

import {ChangeEvent} from "react";
import {useRouter, usePathname} from "next/navigation";
import {SelectableProfile} from "@/lib/types/dev";

interface Props {
  value: string;
  defaultValue: string;
  options: SelectableProfile[]
}

export default function ProfileSelect({value, options, defaultValue}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  function changeProfile(event: ChangeEvent<HTMLSelectElement>) {
    router.push(`${pathname}${event.target.value !== defaultValue ? `?profile=${event.target.value}` : ''}`);
  }

  return (
    <select className="ml-auto p-1 border border-neutral-600 rounded-md focus:outline-none" value={value} onChange={changeProfile}>
      {options.map(o => (<option key={o.id} value={o.id}>{o.name}</option>))}
    </select>
  )
}