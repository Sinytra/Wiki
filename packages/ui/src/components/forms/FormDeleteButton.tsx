'use client'

import {useFormStatus} from "react-dom";
import {Button} from "@repo/ui/components/button";
import {Loader2Icon} from "lucide-react";
import * as React from "react";

export default function FormDeleteButton({children}: { children?: any }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending}
            onClick={event => event.stopPropagation()}
            variant="destructiveSecondary"
    >
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      {children}
    </Button>
  );
}