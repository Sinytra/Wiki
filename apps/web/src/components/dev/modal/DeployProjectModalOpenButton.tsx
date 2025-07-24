'use client'

import * as React from "react";
import {useContext} from "react";
import DeployProjectModalButton from "@/components/dev/modal/DeployProjectModalButton";
import {DeployProjectContext} from "@/components/dev/modal/DeployProjectContextProvider";

export default function DeployProjectModalOpenButton(props: any) {
  const {setOpen} = useContext(DeployProjectContext)!;

  return (
    <DeployProjectModalButton onClick={() => setOpen(true)} {...props} />
  );
}