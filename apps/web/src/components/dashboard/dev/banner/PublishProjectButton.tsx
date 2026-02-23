'use client'

import {FormActionResult, useFormHandlingAction} from "@/lib/forms/forms";
import {useRouter} from "@/lib/locales/routing";
import {useForm} from "react-hook-form";
import {emptySchema} from "@/lib/forms/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@repo/ui/components/form";
import {Button} from "@repo/ui/components/button";
import {z} from "zod";
import {toast} from "sonner";

interface Props {
  formAction: () => Promise<FormActionResult>;
  successMsg: string;
  children: any;
}

export default function PublishProjectButton({formAction, successMsg, children}: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof emptySchema>>({
    resolver: zodResolver(emptySchema)
  });
  const action = useFormHandlingAction(form, formAction, () => {
    router.refresh();
    toast.success(successMsg);
  });

  return (
    <Form {...form}>
      <form action={action}>
        <Button type="submit" size="sm" className="bg-primary/60">
          {children}
        </Button>
      </form>
    </Form>
  )
}