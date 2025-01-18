'use client'

import {useContext} from "react";
import {ProjectSettingsContext} from "@/components/dev/modal/ProjectSettingsContextProvider";
import {SettingsIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function ProjectSourceSettingsButton() {
  const {setOpen} = useContext(ProjectSettingsContext)!;

  return (
    <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => setOpen(true)}>
      <SettingsIcon className="w-4 h-4"/>
    </Button>
  );
}