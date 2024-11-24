'use client'

import {Mod} from "@/lib/service";
import ProjectRegisterForm from "@/components/dev/ProjectRegisterForm";
import {useContext, useState} from "react";
import {GetStartedContext} from "@/components/dev/get-started/GetStartedContextProvider";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {SettingsIcon} from "lucide-react";
import {projectEditSchema} from "@/lib/forms/schemas";

export interface ProjectEditFormProps {
  mod: Mod;
  state?: any;
  autoSubmit?: boolean;

  formAction: (data: any) => Promise<any>
}

export default function ProjectSettingsForm({mod, state, formAction, autoSubmit}: ProjectEditFormProps) {
  const [open, setOpen] = useState(false);
  const {startTransition} = useContext(GetStartedContext)!;

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
      <ProjectRegisterForm startTransition={startTransition} defaultValues={defaultValues} isAdmin={false} open={open}
                           setOpen={setOpen} formAction={formAction} state={state} autoSubmit={autoSubmit}
                           translations="ProjectSettingsForm"
                           schema={projectEditSchema}
                           lateAutoSubmit
                           trigger={
                             <Button variant="secondary" size="icon">
                               <SettingsIcon className="w-4 h-4"/>
                             </Button>
                           }/>
  )
}