import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import {ReactNode} from "react";
import type {useTranslations} from "next-intl";

type MessageKey = Parameters<typeof useTranslations>[0];

export default function FormWrapper({keys, children}: {keys?: MessageKey[]; children: ReactNode}) {
  return (
    <ClientLocaleProvider keys={['FormActions', 'GenericForm', ...(keys || [])]}>
      {children}
    </ClientLocaleProvider>
  )
}