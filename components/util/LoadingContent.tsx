import {LoaderCircleIcon} from "lucide-react";

export default function LoadingContent() {
  return (
    <div className="flex items-center text-base text-muted-foreground">
      <LoaderCircleIcon className="mr-2 h-5 w-5 animate-spin"/>
      Loading...
    </div>
  )
}