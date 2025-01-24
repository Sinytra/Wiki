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
    <div className="w-full flex flex-col items-center p-2 gap-4">
      <span className="text-foreground text-lg">
        {title}
      </span>

      <div className="p-1">
        <Icon className="w-9 h-9 text-foreground" strokeWidth={1.5}/>
      </div>

      <span className="text-muted-foreground text-sm text-center">
        {desc}
      </span>

      <PrimaryButton variant="muted" size="sm" className="w-36 text-sm! mt-2" onClick={onClick}
                     asChild={href !== undefined}>
        {href !== undefined
          ?
          <Link href={href}>
            <ButtonIcon className="mr-2 w-4 h-4"/>
            {button}
          </Link>
          :
          <>
            <ButtonIcon className="mr-2 w-4 h-4"/>
            {button}
          </>
        }
      </PrimaryButton>
    </div>
  )
}

export default function GetStartedModal({
                                          defaultValues,
                                          state,
                                          isAdmin,
                                          formAction
                                        }: Omit<ProjectRegisterFormProps, 'open' | 'setOpen' | 'schema'>) {
  const {open, setOpen} = useContext(GetStartedContext)!;
  const [registerOpen, setRegisterOpen] = useState(false);
  const t = useTranslations('GetStartedModal');

  return (<>
    <ProjectRegisterForm open={registerOpen} setOpen={setRegisterOpen} defaultValues={defaultValues} state={state}
                         schema={projectRegisterSchema}
                         isAdmin={isAdmin}
                         formAction={formAction}
                         redirectToProject/>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="border border-neutral-600 bg-[hsl(var(--sidebar-background))]" size="sm">
          <HammerIcon className="mr-2 w-4 h-4"/>
          {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center">
            {t('title')}
          </DialogTitle>
        </DialogHeader>
        <div tabIndex={0} className="flex flex-col sm:flex-row justify-between gap-4 divide-neutral-600">
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
          <div className="w-full h-[1px] sm:w-[1px] sm:h-full bg-neutral-600" aria-hidden="true"/>
          <DocumentationOption
            title={t('community.title')}
            desc={t('community.desc')}
            button={t('community.button')}
            icon={UsersIcon}
            buttonIcon={BookOpenIcon}
            href="/about/community"
          />
        </div>
      </DialogContent>
    </Dialog>
  </>)
}