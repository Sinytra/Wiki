import {ReactElement} from "react";
import {Alert, AlertDescription, AlertTitle} from "@repo/ui/components/alert";
import {BanIcon, InfoIcon, RocketIcon, TriangleAlertIcon} from "lucide-react";
import {useTranslations} from "next-intl";

type Variant = 'default' | 'info' | 'warning' | 'danger';

export default function Callout({variant = 'default', title, children}: { variant?: Variant; title?: string; children?: ReactElement<any> }) {
  const t = useTranslations('Callout');
  const icons: {[key in Variant]: any} = {
    default: RocketIcon,
    info: InfoIcon,
    warning: TriangleAlertIcon,
    danger: BanIcon
  };
  const ActiveIcon = icons[variant] || icons['default'];

  return (
    <Alert className="not-prose bg-primary-alt my-4" variant={variant === 'danger' ? 'destructive' : variant || 'default'}>
      <ActiveIcon className="h-4 w-4"/>
      <AlertTitle>
        {title || t(variant)}
      </AlertTitle>
      <AlertDescription className="[&_a]:underline [&_a]:underline-offset-2">
        {children}
      </AlertDescription>
    </Alert>
  )
}