'use client'

import {Button} from "@repo/ui/components/button";
import {toast} from "sonner";
import * as React from "react";
import {ReactNode, useRef, useState} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/components/dialog";
import {useTranslations} from "next-intl";
import {useRouter} from "@/lib/locales/routing";
import FormDeleteButton from "@repo/ui/components/forms/FormDeleteButton";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {emptySchema} from "@/lib/forms/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormActionResult, useFormHandlingAction} from "@/lib/forms/forms";
import {Form} from "@repo/ui/components/form";

interface Properties {
  trigger: ReactNode;
  localeNamespace: string;
  formAction: () => Promise<FormActionResult>;
  redirectTo?: string;
  onOpenChange?: (open: boolean) => void;
}

export default function GenericDeleteModal({trigger, localeNamespace, formAction, redirectTo, onOpenChange}: Properties) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations(localeNamespace as any) as any;
  const u = useTranslations('GenericForm');

  function changeOpen(open: boolean) {
    setOpen(open);
    onOpenChange?.(open);
  }

  const form = useForm<z.infer<typeof emptySchema>>({
    resolver: zodResolver(emptySchema)
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const action = useFormHandlingAction(form, formAction, () => {
    changeOpen(false);
    toast.success(t('success'));

    if (redirectTo) {
      router.push({ pathname: redirectTo });
    } else {
      router.refresh();
    }
  });

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="outline-hidden!">
        <DialogHeader>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('desc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="relative focus:outline-hidden" tabIndex={0}>
            <form ref={formRef} action={action} className="space-y-6 focus:outline-hidden">
              {form.formState.errors.root?.custom?.message &&
                <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
                    <p className="text-sm text-destructive">
                      {form.formState.errors.root.custom.message}
                    </p>
                </div>
              }

              {/*@ts-expect-error details*/}
              {form.formState.errors.root?.custom?.details &&
                <details className="slim-scrollbar max-h-20 w-fit overflow-y-auto text-sm text-destructive">
                    <summary className="mb-2">
                      {t('errors.details')}
                    </summary>
                  {/*@ts-expect-error details*/}
                    <code className="text-xs">{form.formState.errors.root.custom.details}</code>
                </details>
              }

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={event => event.stopPropagation()}>
                    {u('cancel')}
                  </Button>
                </DialogClose>
                <FormDeleteButton>
                  {t('submit')}
                </FormDeleteButton>
              </DialogFooter>
            </form>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}