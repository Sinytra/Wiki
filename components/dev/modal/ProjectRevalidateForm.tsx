'use client'

import {Button} from "@/components/ui/button";
import {Loader2Icon, RefreshCwIcon} from "lucide-react";
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
import LinkTextButton from "@/components/ui/link-text-button";
import {useTranslations} from "next-intl";
import {useRouter} from "@/lib/locales/routing";

interface Properties {
  action: () => Promise<any>;
}

function RevalidateButton({ text }: { text: string }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      {text}
    </Button>
  );
}

export default function ProjectRevalidateForm({action}: Properties) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('ProjectRevalidateForm');
  const router = useRouter();

  const formAction = async () => {
    await action();
    setOpen(false);
    toast.success(t('success'));
    startTransition(() => router.refresh());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCwIcon className="sm:mr-2 w-4 h-4"/>
          <span className="hidden sm:block">Reload</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
          <DialogDescription asChild className="!mt-4">
            <div>
              {t('primary')}

              <p className="mt-4">
                {t('secondary')}
              </p>

              <p className="mt-4">
                {t.rich('tertiary', {
                  link: (chunks) => (
                    <LinkTextButton target="_blank" href="/about" className="!font-normal !text-foreground">
                      {chunks}
                    </LinkTextButton>
                  )
                })}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form tabIndex={0} action={formAction} className="focus:outline-none space-y-6">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t('cancel')}
              </Button>
            </DialogClose>
            <RevalidateButton text={t('submit')}/>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}