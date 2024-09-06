import {ReactElement} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {RocketIcon} from "lucide-react";

type Variant = 'default' | 'danger';

export default function Callout({variant = 'default', children}: { variant?: Variant, children?: ReactElement }) {
  return (
    <Alert className="not-prose bg-muted" variant={variant === 'danger' ? 'destructive' : 'default'}>
      <RocketIcon className="h-4 w-4"/>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription className="[&_a]:underline [&_a]:underline-offset-2">
        {children}
      </AlertDescription>
    </Alert>
  )
}