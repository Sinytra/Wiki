'use client'

import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import * as React from "react";

export default function FormDeleteButton({text}: { text: string }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending}
            onClick={event => event.stopPropagation()}
            variant="destructive" className="bg-destructive! text-primary-alt!"
    >
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      {text}
    </Button>
  );
}