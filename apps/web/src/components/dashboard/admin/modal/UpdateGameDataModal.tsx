'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormField, FormItem, FormLabel,} from "@repo/ui/components/form";
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
import {updateGameDataSchema} from "@/lib/forms/schemas";
import {useTranslations} from "next-intl";
import {cn} from "@repo/ui/lib/utils";
import {RefreshCcwIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {useRouter} from "@/lib/locales/routing";
import FormSubmitButton from "@repo/ui/components/forms/FormSubmitButton";
import {Switch} from "@repo/ui/components/switch";
import clientActions from "@/lib/forms/clientActions";
import {toast} from "sonner";
import usePageDataReloadTransition from "@repo/shared/client/usePageDataReloadTransition";

export default function UpdateGameDataModal() {
  const [open, setOpen] = useState(false);
  const reload = usePageDataReloadTransition();

  const t = useTranslations('UpdateGameDataModal');
  const u = useTranslations('FormActions');

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(updateGameDataSchema)
  });
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await clientActions.handleUpdateGameDataFormClient(data) as any;

    if (resp.success) {
      setOpen(false);
      toast.success(t('success.title'), {description: t('success.desc')});

      reload(() => router.refresh());
    } else if (resp.error) {
      // @ts-expect-error details
      form.setError('root.custom', {message: u(`errors.${resp.error}`), details: resp.data.details});
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
            <RefreshCcwIcon className="mr-2 h-4 w-4"/>
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
                  name="update_loader"
                  render={({field}) => (
                    <FormItem
                      className="flex flex-row items-center justify-between rounded-lg border border-tertiary p-3">
                      <div className="mb-0!">
                        <FormLabel>
                          {t('update_loader.title')}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch className="mt-0! mb-0!" checked={field.value} onCheckedChange={field.onChange}/>
                      </FormControl>
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
                  <FormSubmitButton>
                    {t('submit')}
                  </FormSubmitButton>
                </DialogFooter>
              </form>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
