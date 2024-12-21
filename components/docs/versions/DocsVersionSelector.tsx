import {DEFAULT_DOCS_VERSION} from "@/lib/constants";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Tag} from "lucide-react";
import DocsVersionSelectWrapper from "@/components/docs/versions/DocsVersionSelectWrapper";

export default function DocsVersionSelector({version, versions}: { version: string; versions: Record<string, string> }) {

  return (
    <DocsVersionSelectWrapper value={version} defaultValue={DEFAULT_DOCS_VERSION}>
      <SelectTrigger className="w-[140px]">
        <Tag className="w-4 h-4 mr-1"/>
        <SelectValue placeholder="Select version"/>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(versions).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </DocsVersionSelectWrapper>
  )
}