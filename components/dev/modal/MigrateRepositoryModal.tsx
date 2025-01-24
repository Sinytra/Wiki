'use client'

import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {useForm} from "react-hook-form";
import {z} from "zod";
import {migrateRepositorySchema} from "@/lib/forms/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import * as React from "react";
import {useEffect} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import SubmitButton from "@/components/dev/SubmitButton";
import {useTranslations} from "next-intl";
import {toast} from "sonner";
import LinkTextButton from "@/components/ui/link-text-button";

interface Properties {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  formAction: (data: any) => Promise<any>;
}

export function MigrateRepositoryModal({isOpen, setOpen, formAction}: Properties) {
  const t = useTranslations('MigrateRepositoryForm');
  const u = useTranslations('FormActions');

  const form = useForm<z.infer<typeof migrateRepositorySchema>>({
    resolver: zodResolver(migrateRepositorySchema)
  });
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await formAction(data) as any;
    if (resp.success) {
      setOpen(false);
      toast.success(t('success.title'), {description: t('success.desc')});
    } else if (resp.install_app) {
      form.setError('root.missing_installation', {message: resp.install_app});
    } else if (resp.error === 'insufficient_repo_perms') {
      // @ts-ignore
      form.setError('root.insufficient_repo_perms', {message: u(`errors.${resp.error}`)});
    } else if (resp.error) {
      // @ts-ignore
      form.setError('root.custom', {message: u(`errors.${resp.error}`), details: resp.details});
    } else if (resp.errors) {
      for (const key in resp.errors) {
        // @ts-ignore
        form.setError(key, {message: u(`errors.${resp.errors[key][0]}`)});
      }
    }
    return resp;
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader tabIndex={0}>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('desc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form tabIndex={0} action={action} className="focus:outline-hidden space-y-6">
            <div className="mt-2 flex flex-row items-center gap-2 w-full">
              <FormField
                control={form.control}
                name="owner"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      {t('owner.title')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t('owner.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('owner.desc')}
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <span>/</span>
              <FormField
                control={form.control}
                name="repo"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      {t('repo.title')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t('repo.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('repo.title')}
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors?.root?.validation_error?.message &&
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.validation_error.message}</p>
            }

            {form.formState.errors?.root?.missing_installation?.message &&
                <p className="text-destructive text-sm">
                  {t.rich('migrate_error.install_app', {
                    link: (chunks) => (
                      <LinkTextButton className="text-destructive! font-medium! underline"
                                      href={form.formState.errors.root!.missing_installation.message!}>
                        {chunks}
                      </LinkTextButton>
                    )
                  })}
                </p>
            }

            {form.formState.errors.root?.custom?.message &&
                <p className="text-destructive text-sm">{form.formState.errors.root.custom.message}</p>
            }

            <DialogFooter>
              <SubmitButton t={{title: t('submit')}}/>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}