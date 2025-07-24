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
import {useContext, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {projectRegisterSchema} from "@/lib/forms/schemas";
import {Input} from "@repo/ui/components/input";
import SubmitButton from "@/components/util/SubmitButton";
import {useTranslations} from "next-intl";
import {Switch} from "@repo/ui/components/switch";
import {cn} from "@repo/ui/lib/utils";
import {ExternalLinkIcon, LightbulbIcon, Loader2Icon, PlusIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {Link, useRouter} from "@/lib/locales/routing";
import {useRouter as useProgressRouter} from "@bprogress/next";
import {useParams} from "next/navigation";
import {GetStartedContext} from "@/components/dev/get-started/GetStartedContextProvider";
import usePageDataReloadTransition from "@repo/shared/client/usePageDataReloadTransition";

export interface ProjectRegisterFormProps {
  defaultValues: any;
  isAdmin: boolean;
  translations?: Parameters<typeof useTranslations>[0];
  redirectToProject?: boolean;
  reloadAfterSubmit?: boolean;

  formAction: (data: any) => Promise<any>
}

export default function ProjectRegisterForm(
  {
    defaultValues,
    isAdmin,
    formAction,
    translations,
    redirectToProject,
    reloadAfterSubmit
  }: ProjectRegisterFormProps
) {
  const params = useParams();
  const progressRouter = useProgressRouter();
  const router = useRouter();
  const {open, setOpen} = useContext(GetStartedContext)!;

  const v = useTranslations(translations || 'ProjectRegisterForm');
  const t = useTranslations('ProjectRegisterForm');
  const u = useTranslations('FormActions');
  const reload = usePageDataReloadTransition();

  const form = useForm<z.infer<typeof projectRegisterSchema>>({
    resolver: zodResolver(projectRegisterSchema),
    defaultValues: defaultValues
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const [canVerifyModrinth, setCanVerifyModrinth] = useState(false);
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await formAction(data) as any;
    if (resp.success) {
      if (redirectToProject && resp.project.id) {
        progressRouter.push(`/${params.locale}/dev/project/${resp.project.id}`);
      }

      setOpen(false);
      toast.success(v('success.title'), {description: v('success.desc')});

      if (reloadAfterSubmit) {
        reload(() => router.refresh());
      }
    } else if (resp.error) {
      // @ts-expect-error details
      form.setError('root.custom', {message: u(`errors.${resp.error}`), details: resp.details});
      setCanVerifyModrinth(resp.can_verify_mr && resp.error === 'ownership');
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
      setCanVerifyModrinth(false);
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
            {v('title')}
          </DialogTitle>
          <DialogDescription>
            {v('desc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="relative focus:outline-hidden" tabIndex={0}>
            {form.formState.isSubmitting &&
              <div
                className="absolute top-1/2 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
                  <Loader2Icon className="mr-2 h-6 w-6 animate-spin"/>
                  <span className="text-lg">{t('submitting')}</span>
              </div>
            }
            <form ref={formRef} action={action}
                  className={cn('space-y-6 focus:outline-hidden', form.formState.isSubmitting && 'invisible')}>
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
                      {t('repo.desc')}
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      {t('branch.title')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="main" {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('branch.desc')}
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
                      {t('path.title')}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="/docs" {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('path.desc')}
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              {isAdmin &&
                <div className="mt-2 flex flex-col gap-4">
                    <FormLabel className="text-base">
                      {t('admin')}
                    </FormLabel>

                    <FormField
                      control={form.control}
                      name="is_community"
                      render={({field}) => (
                        <FormItem
                          className="flex flex-row items-center justify-between rounded-lg border border-tertiary p-3">
                          <div className="mb-0!">
                            <FormLabel>
                              {t('is_community.title')}
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch className="mt-0! mb-0!" checked={field.value} onCheckedChange={field.onChange}/>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                </div>
              }

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

              {canVerifyModrinth &&
                <div className="flex flex-col gap-1 rounded-md border border-info p-3">
                    <p className="flex flex-row items-start text-secondary">
                        <LightbulbIcon className="mt-0.5 mr-2 inline-block h-4 w-4 shrink-0"/>
                        <span className="text-sm text-secondary">
                            {t.rich('connect_modrinth.desc', {
                              b: (chunks: any) => <span className="text-primary">{chunks}</span>
                            })}
                        </span>
                    </p>
                    <div className="ml-auto">
                        <Link href="/dev/settings" target="_blank">
                            <Button variant="outline" type="button" size="sm">
                                {t('connect_modrinth.settings')}
                                <ExternalLinkIcon className="ml-2 h-4 w-4"/>
                            </Button>
                        </Link>
                    </div>
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
  )
}
