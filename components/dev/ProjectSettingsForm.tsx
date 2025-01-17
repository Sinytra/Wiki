'use client'

import {Project} from "@/lib/service";
import ProjectRegisterForm from "@/components/dev/ProjectRegisterForm";
import * as React from "react";
import {useContext} from "react";
import {Button} from "@/components/ui/button";
import {SettingsIcon} from "lucide-react";
import {projectEditSchema} from "@/lib/forms/schemas";
import {ProjectSettingsContext} from "@/components/dev/new/ProjectSettingsContextProvider";

export interface ProjectEditFormProps {
  mod: Project;
  state?: any;
  autoSubmit?: boolean;

  formAction: (data: any) => Promise<any>
}

export default function ProjectSettingsForm({mod, state, formAction, autoSubmit}: ProjectEditFormProps) {
  const {open, setOpen} = useContext(ProjectSettingsContext)!;
  // const {startTransition} = useContext(GetStartedContext)!;

  const parts = mod.source_repo!.split('/');
  const defaultValues = {
    id: mod.id,
    owner: parts[0],
    repo: parts[1],
    branch: mod.source_branch,
    path: mod.source_path,
    mr_code: state?.mr_code
  };

  return (
      <ProjectRegisterForm defaultValues={defaultValues} isAdmin={false} open={open}
                           setOpen={setOpen} formAction={formAction} state={state} autoSubmit={autoSubmit}
                           translations="ProjectSettingsForm"
                           schema={projectEditSchema}
                           lateAutoSubmit
                           trigger={
                             <Button variant="outline" size="sm">
                               <SettingsIcon className="mr-2 w-4 h-4"/>
                               Settings
                             </Button>
                           }/>
  )
}