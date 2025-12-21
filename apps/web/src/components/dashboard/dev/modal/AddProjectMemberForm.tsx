'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
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
import {useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {addProjectMemberSchema} from "@/lib/forms/schemas";
import {Input} from "@repo/ui/components/input";
import {useTranslations} from "next-intl";
import {cn} from "@repo/ui/lib/utils";
import {PlusIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {useRouter} from "@/lib/locales/routing";
import usePageDataReloadTransition from "@repo/shared/client/usePageDataReloadTransition";
import FormSubmitButton from "@repo/ui/components/forms/FormSubmitButton";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@repo/ui/components/select";
import {ProjectMemberRole} from "@repo/shared/types/api/devProject";

interface Props {
  formAction: (data: any) => Promise<any>;
}

export default function AddProjectMemberForm({formAction}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const t = useTranslations('AddProjectMemberForm');
  const u = useTranslations('ProjectMemberRole');
  const v = useTranslations('FormActions');
  const reload = usePageDataReloadTransition();

  const form = useForm<z.infer<typeof addProjectMemberSchema>>({
    resolver: zodResolver(addProjectMemberSchema)
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await formAction(data) as any;

    if (resp.success) {
      setOpen(false);
      toast.success(t('success.title'), {description: t('success.desc')});

      reload(() => router.refresh());
    } else if (resp.error) {
      // @ts-expect-error details
      form.setError('root.custom', {message: v(`errors.${resp.error}`), details: resp.data.details});
    } else if (resp.errors) {
      for (const key in resp.errors) {
        // @ts-expect-error message
        form.setError(key, {message: v(`errors.${resp.errors[key][0]}`)});
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
            <form ref={formRef} action={action} className={cn('space-y-6 focus:outline-hidden')}>
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      {t('username.title')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t('username.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('username.desc')}
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      {t('role.title')}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('role.placeholder')}/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ProjectMemberRole.OWNER}>{u(ProjectMemberRole.OWNER)}</SelectItem>
                        <SelectItem value={ProjectMemberRole.MEMBER}>{u(ProjectMemberRole.MEMBER)}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t('role.desc')}
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
