import * as React from "react";
import {cn} from "@repo/ui/lib/utils";
import {useTranslations} from "next-intl";

export default function IconModalSection({name, tKey, icon: Icon, className, values}: { name: Parameters<typeof useTranslations>[0]; tKey: string; icon: any; className: string; values?: any }) {
  const t = useTranslations(name);
  return (
    <p className={cn('flex flex-row items-start', className)}>
      <Icon className="mt-0.5 mr-2 inline-block h-4 w-4 shrink-0"/>
      <span>
        {/*@ts-expect-error the key is fine*/}
        {t.rich(tKey, {
          b: (chunks: any) => <span className="font-medium text-primary">{chunks}</span>,
          ...values
        })}
      </span>
    </p>
  )
}
