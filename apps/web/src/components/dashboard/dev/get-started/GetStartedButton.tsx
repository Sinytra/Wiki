'use client'

import {PlusIcon} from "lucide-react";
import * as React from "react";
import {useContext} from "react";
import {useTranslations} from "next-intl";
import {GetStartedContext} from "@/components/dashboard/dev/get-started/GetStartedContextProvider";
import {Button} from "@repo/ui/components/button";

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
