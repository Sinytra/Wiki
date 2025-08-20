'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/components/dialog";
import * as React from "react";
import {useEffect, useState} from "react";
import {revalidateCacheSchema} from "@/lib/forms/schemas";
import {Input} from "@repo/ui/components/input";
import SubmitButton from "@/components/util/SubmitButton";
import {useTranslations} from "next-intl";
import {cn} from "@repo/ui/lib/utils";
import {RefreshCcw} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {useRouter} from "@/lib/locales/routing";
import {toast} from "sonner";

export interface RevalidateCacheModalProps {
  formAction: (data: any) => Promise<any>
}

export function RevalidateCacheModal({formAction}: RevalidateCacheModalProps) {
  const [open, setOpen] = useState(false);

  const t = useTranslations('RevalidateCacheModal');
  const u = useTranslations('FormActions');

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(revalidateCacheSchema)
  });
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await formAction(data) as any;
    if (resp.success) {
      router.refresh();
      setOpen(false);

      toast.success(t('success'));
    } else if (resp.errors) {
      for (const key in resp.errors) {
        // @ts-expect-error message
        form.setError(key, {message: u(`errors.${resp.errors[key][0]}`)});
      }
    }
    return resp;
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [form, open]);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <RefreshCcw className="mr-2 h-4 w-4"/>
            {t('button')}
          </Button>
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
              <form action={action} className={cn('space-y-6 focus:outline-hidden')}>

                <FormField
                  control={form.control}
                  name="tag"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>
                        {t('tag.title')}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('tag.desc')}
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                {form.formState.errors.root?.custom?.message &&
                  <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
                      <p className="text-sm text-destructive">
                        {form.formState.errors.root.custom.message}
                      </p>
                  </div>
                }

                <DialogFooter className="flex w-full flex-row">
                  <SubmitButton/>
                </DialogFooter>
              </form>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
