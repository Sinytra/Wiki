import {ReactElement} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {RocketIcon} from "lucide-react";

export default function Callout({danger, children}: { danger?: boolean, children?: ReactElement }) {
  return (
    <Alert className="not-prose bg-muted" variant={danger ? 'destructive' : 'default'}>
      <RocketIcon className="h-4 w-4"/>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        {children}
      </AlertDescription>
    </Alert>
  )
}