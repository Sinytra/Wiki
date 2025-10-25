'use client'

import {Button} from "@repo/ui/components/button";
import * as React from "react";
import {startTransition, useContext} from "react";
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
import {HardDriveDownloadIcon, InfoIcon, ShieldIcon} from "lucide-react";
import IconModalSection from "@/components/util/IconModalSection";
import {DevProjectSidebarContext} from "@/components/dashboard/dev/navigation/DevProjectSidebarContextProvider";
import {DeployProjectContext} from "@/components/dashboard/dev/modal/DeployProjectContextProvider";
import DeployProjectModalButton from "@/components/dashboard/dev/modal/DeployProjectModalButton";
import FormSubmitButton from "@repo/ui/components/forms/FormSubmitButton";

interface Properties {
  action: () => Promise<any>;
}

export default function DeployProjectModal({action}: Properties) {
  const {open, setOpen} = useContext(DeployProjectContext)!;
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
        <DeployProjectModalButton disabled={sidebarCtx?.connected}/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
          <DialogDescription asChild className="mt-4! text-left">
            <div>
              {t.rich('primary', {
                b: (chunks: any) => <span className="font-medium text-primary">{chunks}</span>
              })}

              <IconModalSection className="mt-4" name="DeployProjectModal" tKey="secondary" icon={ShieldIcon}/>
              {/*<IconModalSection className="mt-4" t={t} tKey="tertiary" icon={LightbulbIcon} values={{*/}
              {/*  link: (chunks: any) => (*/}
              {/*    <LinkTextButton target="_blank" href="/about" className="font-normal! text-primary!">*/}
              {/*      {chunks}*/}
              {/*    </LinkTextButton>*/}
              {/*  )*/}
              {/*}} />*/}
              <IconModalSection className="mt-4 opacity-70" name="DeployProjectModal" tKey="note" icon={InfoIcon}/>
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
            <FormSubmitButton icon={HardDriveDownloadIcon}>
              {t('submit')}
            </FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}