import { ReactNode } from 'react';
import TooltipImg from '@/components/docs/shared/game/TooltipImg';
import { ItemProperties } from '@repo/shared/types/service';
import { useTranslations } from 'next-intl';

interface Props {
  id: string;
  name: string;
  properties?: ItemProperties | null;
  children?: ReactNode;
}

export default function InvTooltip({ id, name, properties, children }: Props) {
  const t = useTranslations('InvTooltip');

  const attackDmg = properties?.[id]?.['attack_damage']?.toString() ?? null;
  const attackSpeed = properties?.[id]?.['attack_speed']?.toString() ?? null;
  const hasStats = attackDmg != null || attackSpeed != null;

  const body = hasStats ? (
    <span>
      <br />
      <br />
      <span className="text-mc-gray">{t('main_hand')}:</span>
      {attackDmg && (
        <>
          <br />
          &nbsp;
          <span className="text-mc-dark-green">{t('attack_dmg', { value: attackDmg })}</span>
        </>
      )}
      {attackSpeed && (
        <>
          <br />
          &nbsp;
          <span className="text-mc-dark-green">{t('attack_speed', { value: attackSpeed })}</span>
        </>
      )}
    </span>
  ) : null;

  return (
    <TooltipImg name={name} body={body}>
      {children}
    </TooltipImg>
  );
}
