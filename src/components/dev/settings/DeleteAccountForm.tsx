'use client'

import {Button} from "@repo/ui/components/button";
import {TrashIcon} from "lucide-react";
import * as React from "react";
import {useState} from "react";
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
import FormDeleteButton from "@/components/util/FormDeleteButton";

interface Properties {
  action: () => Promise<any>;
}

export default function DeleteAccountForm({action}: Properties) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('UserSettings.account');

  const formAction = async () => {
    await action();

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className={`
          border-destructive-secondary bg-primary border font-semibold hover:bg-secondary/80
          data-[pending=true]:text-destructive/90
        `}>
          <TrashIcon className="mr-2 h-4 w-4"/>
          <span>
            {t('delete.button')}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('delete_modal.title')}
          </DialogTitle>
          <DialogDescription>
            {t('delete_modal.desc')}
          </DialogDescription>
        </DialogHeader>

        <form tabIndex={0} action={formAction} className="space-y-6 focus:outline-hidden">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t('delete_modal.cancel')}
              </Button>
            </DialogClose>
            <FormDeleteButton text={t('delete_modal.button')} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}