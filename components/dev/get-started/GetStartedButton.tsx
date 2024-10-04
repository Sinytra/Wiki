'use client'

import {RocketIcon} from "lucide-react";
import PrimaryButton from "@/components/ui/custom/PrimaryButton";
import * as React from "react";
import {useTranslations} from "next-intl";
import {useContext} from "react";
import {GetStartedContext} from "@/components/dev/get-started/GetStartedContextProvider";

export default function GetStartedButton() {
  const t = useTranslations('GetStartedButton');
  const {setOpen} = useContext(GetStartedContext)!;

  return (
    <PrimaryButton className="my-1" onClick={() => setOpen(true)}>
      <RocketIcon className="mr-2 w-4 h-4"/>
      {t('title')}
    </PrimaryButton>
  );
}