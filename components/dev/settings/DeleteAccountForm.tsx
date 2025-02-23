'use client'

import {Button} from "@/components/ui/button";
import {Loader2Icon, TrashIcon} from "lucide-react";
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
} from "@/components/ui/dialog";
import {useFormStatus} from "react-dom";
import {useTranslations} from "next-intl";

interface Properties {
  action: () => Promise<any>;
}

function DeleteButton({ text }: { text: string }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending} variant="destructive" className="text-primary-alt hover:text-primary bg-destructive!">
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      {text}
    </Button>
  );
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
        <Button variant="destructive" size="sm" className="font-semibold bg-primary hover:bg-secondary/80 border data-[pending=true]:text-destructive/90 border-destructive-secondary">
          <TrashIcon className="mr-2 w-4 h-4"/>
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

        <form tabIndex={0} action={formAction} className="focus:outline-hidden space-y-6">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t('delete_modal.cancel')}
              </Button>
            </DialogClose>
            <DeleteButton text={t('delete_modal.button')} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}