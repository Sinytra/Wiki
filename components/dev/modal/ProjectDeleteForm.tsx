'use client'

import {Button} from "@/components/ui/button";
import {Loader2Icon, TrashIcon} from "lucide-react";
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
} from "@/components/ui/dialog";
import {useFormStatus} from "react-dom";
import {useTranslations} from "next-intl";
import {useRouter} from "@/lib/locales/routing";

interface Properties {
  action: () => Promise<any>;
}

function DeleteButton({ text }: { text: string }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending} variant="destructive" className="bg-destructive! text-primary-alt!">
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      {text}
    </Button>
  );
}

export default function ProjectDeleteForm({action}: Properties) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('ProjectDeleteForm');

  const formAction = async () => {
    await action();

    setOpen(false);
    toast.success(t('success'));

    startTransition(() => router.refresh());
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
            <DeleteButton text={t('submit')} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}