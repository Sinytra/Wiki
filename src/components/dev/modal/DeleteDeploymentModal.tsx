'use client'

import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";
import {toast} from "sonner";
import * as React from "react";
import {startTransition, useContext, useState} from "react";
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
import {useTranslations} from "next-intl";
import {useRouter} from "@/lib/locales/routing";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {DropdownMenuContext} from "@/components/ui/custom/ContextDropdownMenu";
import FormDeleteButton from "@/components/ui/custom/FormDeleteButton";

interface Properties {
  loading: boolean;
  action: () => Promise<any>;
}

export default function DeleteDeploymentModal({action, loading}: Properties) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('DeleteDeploymentModal');

  const dropdownCtx = useContext(DropdownMenuContext);

  function onOpenChange(open: boolean) {
    setOpen(open);
    dropdownCtx?.setModalOpen(open);
  }

  const formAction = async () => {
    await action();

    onOpenChange(false);
    toast.success(t('success'));

    startTransition(() => router.refresh());
  }

  // TODO Warn when removing active deployment
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem onClick={event => event.stopPropagation()}
                          onSelect={e => e.preventDefault()}
                          disabled={loading}
        >
          <span className="flex cursor-pointer flex-row items-center text-destructive">
            <TrashIcon className="mr-2 size-3"/>
            {t('trigger')}
          </span>
        </DropdownMenuItem>
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
              <Button type="button" variant="secondary" onClick={event => event.stopPropagation()}>
                {t('cancel')}
              </Button>
            </DialogClose>
            <FormDeleteButton text={t('submit')}/>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}