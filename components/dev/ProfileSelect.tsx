'use client'

import {useRouter, usePathname} from "next/navigation";
import {SelectableProfile} from "@/lib/types/dev";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Props {
  value: string;
  defaultValue: string;
  options: SelectableProfile[]
}

export default function ProfileSelect({value, options, defaultValue}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  function changeProfile(value: string) {
    router.push(`${pathname}${value !== defaultValue ? `?profile=${value}` : ''}`);
  }

  return (
    <Select value={value} defaultValue={defaultValue} onValueChange={changeProfile}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select profile"/>
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}
      </SelectContent>
    </Select>
  )
}