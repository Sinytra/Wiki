'use client'

import {Project} from "@/lib/service";
import ProjectRegisterForm from "@/components/dev/modal/ProjectRegisterForm";
import * as React from "react";
import {useContext} from "react";
import {Button} from "@/components/ui/button";
import {SettingsIcon} from "lucide-react";
import {projectEditSchema} from "@/lib/forms/schemas";
import {ProjectSettingsContext} from "@/components/dev/modal/ProjectSettingsContextProvider";
import {useTranslations} from "next-intl";

export interface ProjectEditFormProps {
  mod: Project;

  formAction: (data: any) => Promise<any>
}

export default function ProjectSettingsForm({mod, formAction}: ProjectEditFormProps) {
  const {open, setOpen} = useContext(ProjectSettingsContext)!;
  const t = useTranslations('ProjectSettingsForm');

  const defaultValues = {
    id: mod.id,
    repo: mod.source_repo,
    branch: mod.source_branch,
    path: mod.source_path
  };

  return (
      <ProjectRegisterForm defaultValues={defaultValues} isAdmin={false} open={open} reloadAfterSubmit
                           setOpen={setOpen} formAction={formAction}
                           translations="ProjectSettingsForm"
                           schema={projectEditSchema}
                           trigger={
                             <Button variant="outline" size="sm">
                               <SettingsIcon className="sm:mr-2 w-4 h-4"/>
                               <span className="hidden sm:block">
                                 {t('button')}
                               </span>
                             </Button>
                           }/>
  )
}