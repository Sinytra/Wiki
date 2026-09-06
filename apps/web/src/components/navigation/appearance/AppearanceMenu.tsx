'use client';

import { ComponentType, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronsLeftRightIcon, ChevronsRightLeftIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import { cn } from '@repo/ui/lib/utils';
import {
  AppearanceSettings,
  DEFAULT_APPEARANCE,
  loadAppearance,
  READING_WIDTHS,
  ReadingWidth,
  saveAppearance,
  Theme,
  THEMES
} from '@/lib/appearance';

type IconComponent = ComponentType<{ className?: string }>;

const THEME_ICONS: Record<Theme, IconComponent> = {
  auto: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon
};

const WIDTH_ICONS: Record<ReadingWidth, IconComponent> = {
  standard: ChevronsRightLeftIcon,
  wide: ChevronsLeftRightIcon
};

function SegmentedControl<T extends string>({
  label,
  options,
  icons,
  value,
  onChange,
  labelFor
}: {
  label: string;
  options: T[];
  icons: Record<T, IconComponent>;
  value: T;
  onChange: (value: T) => void;
  labelFor: (value: T) => string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-secondary">{label}</span>
      <div className="flex flex-row divide-x divide-tertiary overflow-hidden rounded-sm border border-tertiary">
        {options.map((option) => {
          const Icon: IconComponent | undefined = icons[option];
          const selected = option === value;

          return (
            <Button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              variant="outline"
              size="sm"
              className={cn(
                'w-full gap-1.5 rounded-none px-2 text-sm transition-colors',
                selected ? 'bg-secondary font-medium text-primary-alt' : 'text-secondary hover:bg-secondary/40'
              )}
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              {labelFor(option)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default function AppearanceMenu({ mobile }: { mobile?: boolean }) {
  const t = useTranslations('AppearanceMenu');
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_APPEARANCE);

  useEffect(() => {
    setSettings(loadAppearance());

    const onStorage = () => setSettings(loadAppearance());

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (settings.theme !== 'auto') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => saveAppearance(settings);

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [settings]);

  const handleUpdate = (patch: Partial<AppearanceSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveAppearance(next);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {mobile ? (
          <Button variant="ghost" className="h-9 w-full justify-start gap-3 px-2 text-base font-normal text-primary">
            <SunIcon className="size-4.5" />
            {t('title')}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn('size-8 text-primary', open && 'bg-secondary text-primary-alt')}
            title={t('title')}
            aria-label={t('title')}
          >
            <SunIcon className="size-4.5" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        align={mobile ? 'start' : 'end'}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          'pointer-events-auto! flex flex-col gap-4 p-3',
          mobile ? 'w-(--radix-popover-trigger-width)' : 'w-72'
        )}
      >
        <SegmentedControl
          label={t('theme.label')}
          options={THEMES}
          icons={THEME_ICONS}
          value={settings.theme}
          onChange={(theme) => handleUpdate({ theme })}
          labelFor={(theme) => t(`theme.${theme}`)}
        />

        <SegmentedControl
          label={t('width.label')}
          options={READING_WIDTHS}
          icons={WIDTH_ICONS}
          value={settings.width}
          onChange={(width) => handleUpdate({ width })}
          labelFor={(width) => t(`width.${width}`)}
        />
      </PopoverContent>
    </Popover>
  );
}
