import {NextIntlClientProvider, useMessages, type useTranslations} from "next-intl";
import {pick} from "lodash";

type MessageKey = Parameters<typeof useTranslations>[0];

export default function ClientLocaleProvider({keys, children}: { keys: MessageKey[]; children: any; }) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider messages={pick(messages, keys)}>
      {children}
    </NextIntlClientProvider>
  )
}