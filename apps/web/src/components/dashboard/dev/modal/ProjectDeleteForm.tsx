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

interface Properties {
  action: () => Promise<any>;
  redirectTo?: string;
}

export default function ProjectDeleteForm({action, redirectTo}: Properties) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('ProjectDeleteForm');

  const formAction = async () => {
    await action();

    setOpen(false);
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
        <Button variant="destructive" size="sm" className={`
          border border-destructive-secondary bg-primary font-semibold hover:bg-secondary/80
          data-[pending=true]:text-destructive/90
        `}>
          <TrashIcon className="mr-2 h-4 w-4"/>
          <span>
            {t('trigger')}
          </span>
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

        <form tabIndex={0} action={formAction} className="space-y-6 focus:outline-hidden">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
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