'use client'

import {Button} from "@repo/ui/components/button";
import {TrashIcon} from "lucide-react";
import {toast} from "sonner";
import * as React from "react";
import {startTransition, useState} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/components/dialog";
import {useTranslations} from "next-intl";
import {useRouter} from "@/lib/locales/routing";
import FormDeleteButton from "@repo/ui/components/forms/FormDeleteButton";
import {AccessKey} from "@repo/shared/types/api/admin";

interface Properties {
  accessKey: AccessKey;
  action: () => Promise<any>;
}

export default function DeleteAccessKeyModal({action, accessKey}: Properties) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('DeleteAccessKeyModal');

  const formAction = async () => {
    await action();

    toast.success(t('success'));

    startTransition(() => router.refresh());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="size-7 p-0 text-destructive" variant="ghost">
          <TrashIcon className="size-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('desc')}
          </DialogDescription>
        </DialogHeader>

        <span className="text-sm text-secondary">
          {t.rich('body', {
            name: () => <span className="font-medium">{accessKey.name}</span>
          })}
        </span>

        <form tabIndex={0} action={formAction} className="space-y-6 focus:outline-hidden">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={event => event.stopPropagation()}>
                {t('cancel')}
              </Button>
            </DialogClose>
            <FormDeleteButton>
              {t('submit')}
            </FormDeleteButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}