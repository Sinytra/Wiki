import {NextIntlClientProvider, useMessages} from "next-intl";
import {pick} from "lodash";

export default function ClientLocaleProvider({keys, children}: { keys: string[]; children: any; }) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider messages={pick(messages, keys)}>
      {children}
    </NextIntlClientProvider>
  )
}