'use client'

import {useRouter} from 'next-nprogress-bar';
import {Select} from "@/components/ui/select";
import {usePathname} from "next/navigation";

export default function DocsVersionSelectWrapper({value, defaultValue, children}: { value?: string; defaultValue?: string; children?: any }) {
  const router = useRouter();
  const pathname = usePathname();

  const changeVersion = (id: any) => {
    const parts = pathname.split('/');
    parts[4] = id;
    router.replace('/' + parts.filter(s => s.length > 0).join('/'));
  };

  return (
    <Select value={value} defaultValue={defaultValue} onValueChange={changeVersion}>
      {children}
    </Select>
  )
}