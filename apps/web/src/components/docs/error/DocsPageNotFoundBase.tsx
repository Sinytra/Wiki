import { useTranslations } from 'next-intl';
import { HouseIcon, TelescopeIcon } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { NavLink } from '@/components/navigation/link/NavLink';

interface Props {
  returnTo?: string;
}

export default function DocsPageNotFoundBase({ returnTo }: Props) {
  const t = useTranslations('DocsPageNotFound');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 pb-[min(25vh,16rem)]">
      <TelescopeIcon className="size-32 rounded-xs opacity-100 sm:size-36" />

      <h1 className="my-2 text-3xl text-primary sm:text-5xl">{t('title')}</h1>

      <p className="w-3/4 text-center text-secondary sm:w-full">{t('desc')}</p>

      <Button asChild className="mt-4">
        <NavLink href={returnTo ?? '/'}>
          <HouseIcon className="mr-2 h-4 w-4" strokeWidth={2.5} />
          {t('return')}
        </NavLink>
      </Button>
    </div>
  );
}
