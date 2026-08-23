import { ReactElement } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { BanIcon, InfoIcon, RocketIcon, TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ToggleChevron from '@repo/ui/util/ToggleChevron';
import { cn } from '@repo/ui/lib/utils';

type Variant = 'default' | 'info' | 'warning' | 'danger';

interface Props {
  variant?: Variant;
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  children?: ReactElement<any>;
}

export default function Callout({ variant = 'default', title, collapsible, collapsed, children }: Props) {
  const t = useTranslations('Callout');
  const icons: { [key in Variant]: any } = {
    default: RocketIcon,
    info: InfoIcon,
    warning: TriangleAlertIcon,
    danger: BanIcon
  };
  const ActiveIcon = icons[variant] || icons['default'];

  const Wrapper = collapsible ? 'details' : 'div';
  const Header = collapsible ? 'summary' : 'div';

  return (
    <Alert
      className="not-prose my-4 bg-primary-alt py-1"
      variant={variant === 'danger' ? 'destructive' : variant || 'default'}
    >
      <ActiveIcon className="size-4" />
      <Wrapper className="group w-full translate-y-0!" open={!collapsible || !collapsed}>
        <Header
          className={cn(
            'flex flex-row items-center justify-between py-2',
            collapsible && 'cursor-pointer list-none [&::-webkit-details-marker]:hidden'
          )}
        >
          <AlertTitle className="mb-0">{title || t(variant)}</AlertTitle>

          {collapsible && <ToggleChevron className="size-4 group-open:rotate-180" animate={false} />}
        </Header>

        <AlertDescription className="col-start-auto mb-2 [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </AlertDescription>
      </Wrapper>
    </Alert>
  );
}
