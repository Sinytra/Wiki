import {Block, CodeBlock, parseProps} from "codehike/blocks"
import {highlight, Pre, RawCode} from "codehike/code"
import {z} from "zod"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import Plastic from '@shikijs/themes/plastic';

const Schema = Block.extend({ tabs: z.array(CodeBlock) })
export default async function CodeTabs(props: unknown) {
  const { tabs } = parseProps(props, Schema)
  return <CodeTabsVerified tabs={tabs} />
}

async function CodeTabsVerified(props: { tabs: RawCode[] }) {
  const { tabs } = props
  const highlighted = await Promise.all(
    tabs.map((tab) => highlight(tab, Plastic)),
  )
  return (
    <Tabs defaultValue={tabs[0]?.meta}>
      <TabsList className="rounded-b-none w-full justify-start bg-[#2b313a]">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.meta} value={tab.meta} className="text-sm px-2 py-1.5 data-[state=active]:bg-[#1e2127]">
            {tab.meta}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={tab.meta} value={tab.meta} className="mt-0!">
          <Pre code={highlighted[i]} className="m-0! rounded-t-none bg-zinc-950" />
        </TabsContent>
      ))}
    </Tabs>
  )
}