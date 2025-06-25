'use client'

import {Button} from "@repo/ui/components/button";
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
} from "@repo/ui/components/dialog";
import {useTranslations} from "next-intl";
import {useRouter} from "@/lib/locales/routing";
import {DropdownMenuItem} from "@repo/ui/components/dropdown-menu";
import FormDeleteButton from "@/components/util/FormDeleteButton";
import { DropdownMenuContext } from "@/components/util/ContextDropdownMenu";

interface Properties {
  loading: boolean;
  action: () => Promise<any>;
  redirectTo?: string;
}

export default function DeleteDeploymentModal({action, loading, redirectTo}: Properties) {
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

    startTransition(() => {
      if (redirectTo) {
        router.push({ pathname: redirectTo });
      } else {
        router.refresh();
      }
    });
  }

  // TODO Warn when removing active deployment
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem onClick={event => event.stopPropagation()}
                          onSelect={e => e.preventDefault()}
                          disabled={loading}
        >
          <span className="text-destructive flex cursor-pointer flex-row items-center">
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