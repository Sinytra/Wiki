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
import {createAccessKeySchema} from "@/lib/forms/schemas";
import {Input} from "@repo/ui/components/input";
import SubmitButton from "@/components/util/SubmitButton";
import {useTranslations} from "next-intl";
import {cn} from "@repo/ui/lib/utils";
import {PlusIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import SaveAccessKeyModal from "@/components/admin/modal/SaveAccessKeyModal";
import {AccessKeyCreationResult} from "@/lib/service/api/adminApi";
import {useRouter} from "@/lib/locales/routing";

export interface CreateAccessKeyModalProps {
  formAction: (data: any) => Promise<any>
}

export default function CreateAccessKeyModal({formAction}: CreateAccessKeyModalProps) {
  const [open, setOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [result, setResult] = useState<AccessKeyCreationResult | null>(null);

  const t = useTranslations('CreateAccessKeyModal');
  const u = useTranslations('FormActions');

  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createAccessKeySchema)
  });
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await formAction(data) as any;
    if (resp.success) {
      router.refresh();
      setResult(resp.result);
      setOpen(false);
      setResultOpen(true);
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
      <SaveAccessKeyModal open={resultOpen} setOpen={setResultOpen} result={result} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusIcon className="mr-2 h-4 w-4"/>
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
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>
                        {t('name.title')}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={t('name.placeholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('name.desc')}
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days_valid"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>
                        {t('days_valid.title')}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="90" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('days_valid.desc')}
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
