'use client'

import {toast} from "sonner";
import {useRouter} from "@bprogress/next";
import {Link2Icon, LoaderCircleIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useFormStatus} from "react-dom";
import {useTranslations} from "next-intl";

function SubmitButton() {
  const {pending} = useFormStatus();
  const t = useTranslations('UserSettings.connections.modrinth');

  return (
    <Button data-pending={pending ? 'true' : 'false'} variant="destructive" size="sm"
            className={`
              border border-destructive-secondary bg-primary font-semibold hover:bg-secondary/80
              data-[pending=true]:text-destructive/90
            `}>
      {pending
        ?
        <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin"/>
        :
        <Link2Icon className="mr-2 h-4 w-4"/>
      }
      {t('disconnect')}
    </Button>
  );
}

export default function UnlinkMRAccountForm({callback}: { callback: () => Promise<any> }) {
  const router = useRouter();
  const t = useTranslations('UserSettings');

  const action = async () => {
    const response = await callback();
    if (response.success) {
      toast.success(t('toast.unlink.success'));
    } else {
      toast.error(t('toast.unlink.error'));
    }
    router.refresh();
  };

  return (
    <form action={action}>
      <SubmitButton />
    </form>
  )
}