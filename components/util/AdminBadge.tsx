import {Badge} from "@/components/ui/badge";
import {useTranslations} from "next-intl";

export default function AdminBadge() {
  const t = useTranslations('Badges');
  return (
    <Badge variant="secondary" className="border-destructive">
      {t('admin')}
    </Badge>
  );
}