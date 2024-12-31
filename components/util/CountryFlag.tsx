import {cn} from "@/lib/utils";

export default function CountryFlag({flag: Flag, className}: { flag: any; className?: string; }) {
  return (
    <Flag width={24} className={cn('rounded-[3px]', className)} />
  )
}