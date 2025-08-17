import {useFormStatus} from "react-dom";
import {Button} from "@repo/ui/components/button";
import {Loader2Icon} from "lucide-react";
import * as React from "react";
import {useTranslations} from "next-intl";

export default function SubmitButton() {
  const {pending} = useFormStatus();
  const t = useTranslations('SubmitButton');

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      {t('title')}
    </Button>
  );
}