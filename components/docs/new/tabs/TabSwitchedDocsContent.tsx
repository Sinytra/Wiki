'use client'

import {ReactNode} from "react";
import {useSearchParams} from "next/navigation";

export default function TabSwitchedDocsContent({main, history}: {main: ReactNode, history: ReactNode}) {
  const searchParams = useSearchParams();

  return searchParams.get('tab') == 'history' && history ? history : main;
}