import {useTranslations} from "next-intl";
import {Badge} from "@repo/ui/components/badge";

export default function LocalBadge() {
  const t = useTranslations('Badges');

  return (
    <Badge variant="destructive">
      {t('local')}
    </Badge>
  );
}