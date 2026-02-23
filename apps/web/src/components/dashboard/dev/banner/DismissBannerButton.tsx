'use client'

import {XIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {FormActionResult, useFormHandlingAction} from "@/lib/forms/forms";
import {useForm} from "react-hook-form";
import {emptySchema} from "@/lib/forms/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "@/lib/locales/routing";
import {z} from "zod";
import {Form} from "@repo/ui/components/form";

interface Props {
  formAction: () => Promise<FormActionResult>;
}

export default function DismissBannerButton({formAction}: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof emptySchema>>({
    resolver: zodResolver(emptySchema)
  });
  const action = useFormHandlingAction(form, formAction, () => {
    router.refresh();
  });

  return (
    <Form {...form}>
      <form action={action}>
        <Button type="submit" size="icon" variant="ghost" className="mb-auto size-5 opacity-50">
          <XIcon className="size-4"/>
        </Button>
      </form>
    </Form>
  )
}