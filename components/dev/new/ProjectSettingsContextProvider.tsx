'use client'

import {createContext, useState} from "react";

export interface ProjectSettingsContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ProjectSettingsContext = createContext<ProjectSettingsContextProps|null>(null);

export default function ProjectSettingsContextProvider({ children }: { children: any }) {
  const [open, setOpen] = useState(false);

  return (
    <ProjectSettingsContext.Provider value={{open, setOpen}}>
      {children}
    </ProjectSettingsContext.Provider>
  )
}