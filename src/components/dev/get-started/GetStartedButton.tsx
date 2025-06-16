'use client'

import {PlusIcon} from "lucide-react";
import * as React from "react";
import {useContext} from "react";
import {useTranslations} from "next-intl";
import {GetStartedContext} from "@/components/dev/get-started/GetStartedContextProvider";
import {Button} from "@/components/ui/button";

export default function GetStartedButton() {
  const t = useTranslations('GetStartedButton');
  const {setOpen} = useContext(GetStartedContext)!;

  return (
    <Button className="my-1" onClick={() => setOpen(true)}>
      <PlusIcon className="mr-2 h-4 w-4"/>
      {t('title')}
    </Button>
  );
}
