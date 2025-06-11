'use client'

import {Button} from "@/components/ui/button";
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
import {HardDriveDownloadIcon, InfoIcon, ShieldIcon} from "lucide-react";
import FormSubmitButton from "@/components/ui/custom/FormSubmitButton";
import IconModalSection from "@/components/util/IconModalSection";
import {DevProjectSidebarContext} from "@/components/dev/navigation/DevProjectSidebarContextProvider";

interface Properties {
  action: () => Promise<any>;
}

export default function DeployProjectModal({action}: Properties) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('DeployProjectModal');
  const sidebarCtx = useContext(DevProjectSidebarContext);

  const formAction = async () => {
    await action();

    setOpen(false);

    startTransition(() => router.refresh());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={sidebarCtx?.connected}>
          <HardDriveDownloadIcon className="mr-2 size-4"/>
          {t('button')}
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

              <IconModalSection className="mt-4" t={t} tKey="secondary" icon={ShieldIcon} />
              {/*<IconModalSection className="mt-4" t={t} tKey="tertiary" icon={LightbulbIcon} values={{*/}
              {/*  link: (chunks: any) => (*/}
              {/*    <LinkTextButton target="_blank" href="/about" className="font-normal! text-primary!">*/}
              {/*      {chunks}*/}
              {/*    </LinkTextButton>*/}
              {/*  )*/}
              {/*}} />*/}
              <IconModalSection className="mt-4 opacity-70" t={t} tKey="note" icon={InfoIcon} />
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
            <FormSubmitButton text={t('submit')} icon={HardDriveDownloadIcon}/>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}