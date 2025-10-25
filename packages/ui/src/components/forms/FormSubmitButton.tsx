import {useFormStatus} from "react-dom";
import {Button} from "@repo/ui/components/button";
import {Loader2Icon} from "lucide-react";
import * as React from "react";

export default function FormSubmitButton({children, icon: Icon}: { children?: any; icon?: any }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2Icon className="mr-2 size-4 animate-spin"/>}
      {!pending && Icon && <Icon className="mr-2 size-4"/>}
      {children}
    </Button>
  );
}