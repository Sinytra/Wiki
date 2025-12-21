'use client'

import {Button} from "@repo/ui/components/button";
import {toast} from "sonner";
import * as React from "react";
import {ReactNode, startTransition, useState} from "react";
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

interface Properties {
  trigger: ReactNode;
  localeNamespace: string;
  formAction: () => Promise<any>;
  redirectTo?: string;
}

export default function GenericDeleteModal({trigger, localeNamespace, formAction, redirectTo}: Properties) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations(localeNamespace as any) as any;

  // TODO Use form and handle errors
  const action = async () => {
    const result = await formAction();
    if (!result.success) {
      toast.error('An unknown error occurred.');
      return;
    }

    toast.success(t('success'));

    startTransition(() => {
      if (redirectTo) {
        router.push({ pathname: redirectTo });
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
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

        <form tabIndex={0} action={action} className="space-y-6 focus:outline-hidden">
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