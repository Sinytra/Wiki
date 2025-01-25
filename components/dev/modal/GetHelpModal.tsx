'use client'

import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {CircleHelpIcon, HardDriveDownloadIcon, PackageIcon} from "lucide-react";
import LinkTextButton from "@/components/ui/link-text-button";
import {MigrateRepositoryModal} from "@/components/dev/modal/MigrateRepositoryModal";
import {useState} from "react";
import {useTranslations} from "next-intl";
import PrimaryButton from "@/components/ui/custom/PrimaryButton";

interface Properties {
  githubAppName?: string;
  migrateFormAction: (data: any) => Promise<any>;
}

export function GetHelpModal({githubAppName, migrateFormAction}: Properties) {
  const [open, setOpen] = useState(false);
  const [migrateOpen, setMigrateOpen] = useState(false);

  const t = useTranslations('GetHelpModal');
  const link = githubAppName ? `https://github.com/apps/${githubAppName}/installations/new` : null;

  return (
    <>
      <MigrateRepositoryModal isOpen={migrateOpen} setOpen={setMigrateOpen} formAction={migrateFormAction}/>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="py-0 h-fit text-secondary underline">
            {t('button')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader tabIndex={0}>
            <DialogTitle>
              {t('title')}
            </DialogTitle>
            <DialogDescription>
              {t('desc')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-2">
            {link &&
                <div className="flex flex-col gap-4">
                    <Label>
                      {t('app.title')}
                    </Label>

                    <PrimaryButton variant="muted" type="button" size="sm" asChild className="w-fit">
                        <LocaleNavLink href={link}>
                            <HardDriveDownloadIcon className="mr-2 h-4 w-4"/>
                          {t('app.button')}
                        </LocaleNavLink>
                    </PrimaryButton>
                </div>
            }

            <div className="flex flex-col gap-4">
              <Label>
                {t('moved.title')}
              </Label>

              <PrimaryButton variant="muted" type="button" size="sm" className="w-fit" onClick={() => {
                setMigrateOpen(true);
                setOpen(false);
              }}>
                <PackageIcon className="mr-2 h-4 w-4"/>
                {t('moved.button')}
              </PrimaryButton>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-primary text-base font-medium">
              {t('other.title')}
            </span>
            <span className="text-secondary text-sm">
              {t('other.desc')}
            </span>

            <LinkTextButton href="/about/publishing#troubleshooting" target="_blank"
                            className="w-fit mt-1 text-inverse">
              <CircleHelpIcon className="mr-2 h-4 w-4"/>
              {t('other.link')}
            </LinkTextButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}