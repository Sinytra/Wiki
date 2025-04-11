import {FileHeading} from "@/lib/docs/metadata";
import {pick} from "lodash";
import DocsGuideNonContentRightSidebarClient from "@/components/docs/side/guide/DocsGuideNonContentRightSidebarClient";
import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";

interface ContentRightSidebarProps {
  headings: FileHeading[];
}

export default async function DocsGuideNonContentRightSidebar({ headings }: ContentRightSidebarProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, 'DocsNonContentRightSidebar')}>
      <DocsGuideNonContentRightSidebarClient headings={headings}/>
    </NextIntlClientProvider>
  )
}