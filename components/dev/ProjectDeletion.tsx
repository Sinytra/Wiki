'use client'

import {Button} from "@/components/ui/button";
import {Loader2Icon, TrashIcon} from "lucide-react";
import {handleDeleteProjectForm} from "@/lib/forms/actions";
import {toast} from "sonner";
import * as React from "react";
import {useContext, useState} from "react";
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
import {GetStartedContext} from "@/components/dev/get-started/GetStartedContextProvider";

function DeleteButton({ text }: { text: string }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending} variant="destructive" className="!text-destructive-foreground !bg-destructive">
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      {text}
    </Button>
  );
}

export default function ProjectDeletion({id}: { id: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {startTransition} = useContext(GetStartedContext)!;
  const t = useTranslations('ProjectDeletionForm');

  const actionWithSlug = handleDeleteProjectForm.bind(null, id);

  const formAction = async () => {
    await actionWithSlug();

    startTransition(() => router.refresh());

    setOpen(false);
    toast.success(t('success'));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="w-9 h-9">
          <TrashIcon className="w-4 h-4"/>
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

        <form tabIndex={0} action={formAction} className="focus:outline-none space-y-6">
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