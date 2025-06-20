import * as React from "react";
import {cn} from "@repo/ui/lib/utils";
import {useTranslations} from "next-intl";

export default function IconModalSection<
  T extends ReturnType<typeof useTranslations<never>>
>({t, tKey, icon: Icon, className, values}: { t: T; tKey: Parameters<T['rich']>[0]; icon: any; className: string; values?: any }) {
  return (
    <p className={cn('flex flex-row items-start', className)}>
      <Icon className="mt-0.5 mr-2 inline-block h-4 w-4 shrink-0"/>
      <span>
        {t.rich(tKey, {
          b: (chunks) => <span className="font-medium text-primary">{chunks}</span>,
          ...values
        })}
      </span>
    </p>
  )
}