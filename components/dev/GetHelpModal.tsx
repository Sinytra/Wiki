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
import {MigrateRepositoryModal} from "@/components/dev/MigrateRepositoryModal";
import {useState} from "react";
import {useTranslations} from "next-intl";

export function GetHelpModal({githubAppName}: { githubAppName?: string }) {
  const [open, setOpen] = useState(false);
  const [migrateOpen, setMigrateOpen] = useState(false);

  const t = useTranslations('GetHelpModal');
  const link = githubAppName ? `https://github.com/apps/${githubAppName}/installations/new` : null;

  return (
    <>
      <MigrateRepositoryModal isOpen={migrateOpen} setOpen={setMigrateOpen}/>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="text-muted-foreground underline">
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

                    <Button type="button" size="sm" asChild className="w-fit">
                        <LocaleNavLink href={link}>
                            <HardDriveDownloadIcon className="mr-2 h-4 w-4"/>
                          {t('app.button')}
                        </LocaleNavLink>
                    </Button>
                </div>
            }

            <div className="flex flex-col gap-4">
              <Label>
                {t('moved.title')}
              </Label>

              <Button type="button" size="sm" className="w-fit" onClick={() => {
                setMigrateOpen(true);
                setOpen(false);
              }}>
                <PackageIcon className="mr-2 h-4 w-4"/>
                {t('moved.button')}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-primary text-base font-medium">
              {t('other.title')}
            </span>
            <span className="text-muted-foreground text-sm">
              {t('other.desc')}
            </span>

            <LinkTextButton href="/about/publishing#troubleshooting" target="_blank"
                            className="w-fit mt-1 text-primary-foreground">
              <CircleHelpIcon className="mr-2 h-4 w-4"/>
              {t('other.link')}
            </LinkTextButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}