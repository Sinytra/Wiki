'use client'

import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import {Button} from "@/components/ui/button";
import {useFormStatus} from "react-dom";
import {LoaderCircleIcon} from "lucide-react";
import {useTranslations} from "next-intl";

function SubmitButton() {
  const {pending} = useFormStatus();
  const t = useTranslations('UserSettings.connections.modrinth');

  return (
    <Button data-pending={pending ? 'true' : 'false'} variant="secondary" size="sm"
            className={`
              border border-brand-modrinth/70 bg-primary font-semibold text-brand-modrinth hover:text-brand-modrinth/90
              data-[pending=true]:text-brand-modrinth/90
            `}>
      {pending
        ?
        <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin"/>
        :
        <ModrinthIcon className="mr-2 h-4 w-4"/>
      }
      {t('connect')}
    </Button>
  );
}

export default function LinkMRAccountForm({callback}: { callback: () => Promise<any> }) {
  return (
    <form action={callback}>
      <SubmitButton/>
    </form>
  )
}