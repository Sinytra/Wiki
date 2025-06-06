'use client'

import {Button} from "@/components/ui/button";
import {InfoIcon, LightbulbIcon, Loader2Icon, RefreshCwIcon} from "lucide-react";
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
import {useFormStatus} from "react-dom";
import LinkTextButton from "@/components/ui/link-text-button";
import {useTranslations} from "next-intl";
import {useRouter} from "@/lib/locales/routing";
import {DevProjectSidebarContext} from "@/components/dev/navigation/DevProjectSidebarContextProvider";

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
  const {connected} = useContext(DevProjectSidebarContext)!;

  const formAction = async () => {
    await action();
    setOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={connected}>
          <RefreshCwIcon className="mr-2 size-4"/>
          <span>Reload</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
          <DialogDescription asChild className="mt-4! text-left">
            <div>
              {t.rich('primary', {
                b: (chunks) => <span className="font-medium text-primary">{chunks}</span>
              })}

              <p className="mt-4">
                {t('secondary')}
              </p>

              <p className="mt-4 flex flex-row items-start">
                <LightbulbIcon className="mt-0.5 mr-2 inline-block h-4 w-4 shrink-0"/>
                <span>
                  {t.rich('tertiary', {
                    link: (chunks) => (
                      <LinkTextButton target="_blank" href="/about" className="font-normal! text-primary!">
                        {chunks}
                      </LinkTextButton>
                    )
                  })}
                </span>
              </p>

              <p className="mt-4 flex flex-row items-start text-secondary opacity-70">
                <InfoIcon className="mt-0.5 mr-2 inline-block h-4 w-4 shrink-0"/>
                {t('note')}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form tabIndex={0} action={formAction} className="space-y-6 focus:outline-hidden">
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