import { ReactElement } from 'react';
import { Alert, AlertDescription, AlertTitle, AlertVariant } from '@repo/ui/components/alert';
import { InfoIcon, LightbulbIcon, MessageSquareWarningIcon, OctagonAlertIcon, TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ToggleChevron from '@repo/ui/util/ToggleChevron';
import { cn } from '@repo/ui/lib/utils';

// Nextra:         / info / warning / error   / important
// GitHub: tip     / note / warning / caution / important
type NextraVariant = 'default' | 'info' | 'warning' | 'danger' | 'important';
type Variant = NextraVariant | AlertVariant;

const FALLBACK_TYPE: AlertVariant = 'tip';

interface Props {
  variant?: Variant;
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  children?: ReactElement<any>;
}

const icons: { [key in AlertVariant]: any } = {
  warning: TriangleAlertIcon,
  note: InfoIcon,
  tip: LightbulbIcon,
  important: MessageSquareWarningIcon,
  caution: OctagonAlertIcon
};

const aliases: { [key in Variant]: AlertVariant } = {
  default: 'note',
  info: 'note',
  warning: 'warning',
  danger: 'caution',
  note: 'note',
  tip: 'tip',
  important: 'important',
  caution: 'caution'
};

export default function Callout({ variant = 'default', title, collapsible, collapsed, children }: Props) {
  const t = useTranslations('Callout');
  const type = aliases[variant] || FALLBACK_TYPE;
  const ActiveIcon = icons[type] || icons[FALLBACK_TYPE];

  const Wrapper = collapsible ? 'details' : 'div';
  const Header = collapsible ? 'summary' : 'div';

  return (
    <Alert className="not-prose my-4 flow-root w-auto bg-primary-alt/80 py-1" variant={type}>
      <ActiveIcon className="size-4" />
      <Wrapper className="group w-full translate-y-0!" open={!collapsible || !collapsed}>
        <Header
          className={cn(
            'flex flex-row items-center justify-between py-2',
            collapsible && 'cursor-pointer list-none [&::-webkit-details-marker]:hidden'
          )}
        >
          <AlertTitle className="mb-0">{title || t(type)}</AlertTitle>

          {collapsible && <ToggleChevron className="size-4 group-open:rotate-180" animate={false} />}
        </Header>

        <AlertDescription className="col-start-auto mb-2 [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </AlertDescription>
      </Wrapper>
    </Alert>
  );
}
