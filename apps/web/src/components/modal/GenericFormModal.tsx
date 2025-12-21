'use client'

import {Button} from "@repo/ui/components/button";
import {toast} from "sonner";
import * as React from "react";
import {ReactNode, useEffect, useRef, useState} from "react";
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
import {useForm} from "react-hook-form";
import {z, ZodObject} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import usePageDataReloadTransition from "@repo/shared/client/usePageDataReloadTransition";
import {FormActionResult, useFormHandlingAction} from "@/lib/forms/forms";
import {Form} from "@repo/ui/components/form";
import FormSubmitButton from "@repo/ui/components/forms/FormSubmitButton";

interface Properties<Schema extends ZodObject> {
  schema: Schema;

  trigger: ReactNode;
  children: (form: ReturnType<typeof useForm<z.infer<Schema>>>) => ReactNode;

  localeNamespace: string;
  formAction: (rawData: any) => Promise<FormActionResult>;
  redirectTo?: string;
}

export default function GenericFormModal<Schema extends ZodObject>({schema, trigger, localeNamespace, formAction, redirectTo, children}: Properties<Schema>) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations(localeNamespace as any) as any;
  const u = useTranslations('GenericForm');

  const reload = usePageDataReloadTransition();
  const form = useForm<z.infer<Schema>>({
    // @ts-expect-error stupid types
    resolver: zodResolver(schema)
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const action = useFormHandlingAction(form, formAction, () => {
    setOpen(false);
    toast.success(t('success'));

    if (redirectTo) {
      router.push({ pathname: redirectTo });
    } else {
      reload(() => router.refresh());
    }
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              {children(form as any)}

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
                <FormSubmitButton>
                  {t('submit')}
                </FormSubmitButton>
              </DialogFooter>
            </form>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}