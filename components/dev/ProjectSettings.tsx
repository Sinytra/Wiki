'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {handleEditProjectForm} from "@/lib/forms/actions";
import {SettingsIcon} from "lucide-react";
import * as React from "react";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {projectRegisterSchema} from "@/lib/forms/schemas";
import {Input} from "@/components/ui/input";
import LinkTextButton from "@/components/ui/link-text-button";
import SubmitButton from "@/components/dev/SubmitButton";
import {useTranslations} from "next-intl";
import {Mod} from "@prisma/client";

export default function ProjectSettings({mod}: { mod: Mod }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('ProjectSettingsForm');
  const u = useTranslations('ProjectRegisterForm');
  const v = useTranslations('FormActions');

  const parts = mod.source_repo.split('/');
  const defaultValues = {
    owner: parts[0],
    repo: parts[1],
    branch: mod.source_branch,
    path: mod.source_path
  };
  const form = useForm<z.infer<typeof projectRegisterSchema>>({
    resolver: zodResolver(projectRegisterSchema),
    defaultValues: defaultValues
  });
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await handleEditProjectForm(data) as any;
    if (resp.success) {
      setOpen(false);
      toast.success(t('success.title'), {description: t('success.desc')});
    } else if (resp.installation_url) {
      form.setError('root.not_installed', {message: resp.installation_url});
    } else if (resp.validation_error) {
      // @ts-ignore
      form.setError('root.validation_error', {message: v(`errors.${resp.validation_error}`)});
    } else if (resp.error) {
      // @ts-ignore
      form.setError('root.custom', {message: v(`errors.${resp.error}`)});
    } else if (resp.errors) {
      for (const key in resp.errors) {
        // @ts-ignore
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
        <Button variant="secondary" size="icon">
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('desc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form tabIndex={0} action={action} className="focus:outline-none space-y-6">
            <div className="flex flex-row items-center gap-2 w-full">
              <FormField
                control={form.control}
                name="owner"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      {u('owner.title')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={u('owner.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {u('owner.desc')}
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
                      {u('repo.title')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={u('repo.placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {u('repo.desc')}
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors?.root?.validation_error?.message &&
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.validation_error.message}</p>
            }

            {form.formState.errors?.root?.not_installed?.message &&
                <p className="text-destructive text-sm">
                  {u.rich('errors.install_app', {
                    link: (chunks) => (
                      <LinkTextButton className="!text-destructive !font-medium underline"
                                      href={form.formState.errors.root!.not_installed.message!}>
                        {chunks}
                      </LinkTextButton>
                    )
                  })}
                </p>
            }

            <FormField
              control={form.control}
              name="branch"
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    {u('branch.title')}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="main" {...field} />
                  </FormControl>
                  <FormDescription>
                    {u('branch.desc')}
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="path"
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    {u('path.title')}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="/docs" {...field} />
                  </FormControl>
                  <FormDescription>
                    {u('path.desc')}
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />

            {form.formState.errors.root?.custom?.message &&
                <p className="text-destructive text-sm">{form.formState.errors.root.custom.message}</p>
            }

            <DialogFooter>
              <SubmitButton t={{title: u('submit')}}/>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
