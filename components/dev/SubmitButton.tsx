import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import * as React from "react";

export default function SubmitButton({ t }: { t?: any }) {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      {t?.title || 'Submit'}
    </Button>
  );
}