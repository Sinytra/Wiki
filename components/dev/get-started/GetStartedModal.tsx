'use client'

import {BookOpenIcon, HammerIcon, PencilRulerIcon, PlusIcon, UsersIcon} from "lucide-react";
import PrimaryButton from "@/components/ui/custom/PrimaryButton";
import * as React from "react";
import {useContext, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {Link} from "@/lib/locales/routing";
import {Button} from "@/components/ui/button";
import ProjectRegisterForm, {ProjectRegisterFormProps} from "@/components/dev/modal/ProjectRegisterForm";
import {GetStartedContext} from "@/components/dev/get-started/GetStartedContextProvider";
import {projectRegisterSchema} from "@/lib/forms/schemas";

function DocumentationOption({title, desc, button, buttonIcon: ButtonIcon, icon: Icon, onClick, href}: {
  title: string,
  desc: string,
  button: string,
  buttonIcon: any,
  icon: React.FC<{ className: any, strokeWidth: any }>
  onClick?: () => void
  href?: string
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4 p-2">
      <span className="text-lg text-primary">
        {title}
      </span>

      <div className="p-1">
        <Icon className="h-9 w-9 text-primary" strokeWidth={1.5}/>
      </div>

      <span className="text-center text-sm text-secondary">
        {desc}
      </span>

      <PrimaryButton variant="muted" size="sm" className="mt-2 w-36 text-sm!" onClick={onClick}
                     asChild={href !== undefined}>
        {href !== undefined
          ?
          <Link href={href}>
            <ButtonIcon className="mr-2 h-4 w-4"/>
            {button}
          </Link>
          :
          <>
            <ButtonIcon className="mr-2 h-4 w-4"/>
            {button}
          </>
        }
      </PrimaryButton>
    </div>
  )
}

export default function GetStartedModal({
                                          defaultValues,
                                          isAdmin,
                                          formAction
                                        }: Omit<ProjectRegisterFormProps, 'open' | 'setOpen' | 'schema'>) {
  const {open, setOpen} = useContext(GetStartedContext)!;
  const [registerOpen, setRegisterOpen] = useState(false);
  const t = useTranslations('GetStartedModal');

  return (<>
    <ProjectRegisterForm open={registerOpen} setOpen={setRegisterOpen} defaultValues={defaultValues}
                         schema={projectRegisterSchema}
                         isAdmin={isAdmin}
                         formAction={formAction}
                         redirectToProject/>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <HammerIcon className="mr-2 h-4 w-4"/>
          {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center">
            {t('title')}
          </DialogTitle>
        </DialogHeader>
        <div tabIndex={0} className="flex flex-col justify-between gap-4 divide-neutral-600 sm:flex-row">
          <DocumentationOption
            title={t('dev.title')}
            desc={t('dev.desc')}
            button={t('dev.button')}
            icon={PencilRulerIcon}
            buttonIcon={PlusIcon}
            onClick={() => {
              setOpen(false);
              setRegisterOpen(true);
            }}
          />
          <div className="h-[1px] w-full bg-neutral-600 sm:h-full sm:w-[1px]" aria-hidden="true"/>
          <DocumentationOption
            title={t('community.title')}
            desc={t('community.desc')}
            button={t('community.button')}
            icon={UsersIcon}
            buttonIcon={BookOpenIcon}
            href="/about/devs/community"
          />
        </div>
      </DialogContent>
    </Dialog>
  </>)
}