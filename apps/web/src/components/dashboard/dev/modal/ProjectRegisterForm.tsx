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
import {useTranslations} from "next-intl";
import {cn} from "@repo/ui/lib/utils";
import {ExternalLinkIcon, LightbulbIcon, Loader2Icon, PlusIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {Link, useRouter} from "@/lib/locales/routing";
import {useRouter as useProgressRouter} from "@bprogress/next";
import {useParams} from "next/navigation";
import {GetStartedContext} from "@/components/dashboard/dev/get-started/GetStartedContextProvider";
import usePageDataReloadTransition from "@repo/shared/client/usePageDataReloadTransition";
import clientActions from "@/lib/forms/clientActions";
import FormSubmitButton from "@repo/ui/components/forms/FormSubmitButton";
import envPublic from "@repo/shared/envPublic";

export interface ProjectRegisterFormProps {
  translations?: Parameters<typeof useTranslations>[0];
  redirectToProject?: boolean;
  reloadAfterSubmit?: boolean;
}

const TROUBLESHOOTING_DOCS_URL = 'docs/portal/publishing#troubleshooting';

export default function ProjectRegisterForm(
  {
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
    resolver: zodResolver(projectRegisterSchema)
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const [canVerifyModrinth, setCanVerifyModrinth] = useState(false);
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await clientActions.handleRegisterProjectFormClient(data) as any;

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
      form.setError('root.custom', {message: u(`errors.${resp.error}`), details: resp.data.details});
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
              <div className={`
                absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center
                gap-2
              `}>
                  <div className="inline-flex flex-10 items-center gap-2">
                      <Loader2Icon className="mr-2 h-6 w-6 animate-spin"/>
                      <span className="text-xl">{t('submitting')}</span>
                  </div>

                  <div className="flex-1 text-center text-base text-secondary">
                    {t('submission.clone')}

                      <p className="mt-4 text-sm text-secondary">
                          *{t('submission.note')}
                      </p>
                  </div>
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

              {form.formState.errors.root?.custom?.message && envPublic.getDocsUrl() &&
                <div className={`
                  flex w-full flex-col items-center justify-between gap-2 rounded-sm border border-info p-3 sm:flex-row
                `}>
                    <p className="flex flex-row items-start text-primary">
                        <LightbulbIcon className="mt-0.5 mr-2 inline-block h-4 w-4 shrink-0"/>
                        <span className="text-sm text-primary">
                          {u.rich('get_help', {
                            link: (chunks) =>
                              <Link className={`underline underline-offset-4 hover:text-primary/80`}
                                    href={`${envPublic.getDocsUrl()}/${TROUBLESHOOTING_DOCS_URL}`} target="_blank">
                                {chunks}
                              </Link>
                          })}
                    </span>
                    </p>
                </div>
              }

              {canVerifyModrinth &&
                <div className="flex flex-col gap-1 rounded-sm border border-info p-3">
                    <p className="flex flex-row items-start text-primary">
                        <LightbulbIcon className="mt-0.5 mr-2 inline-block h-4 w-4 shrink-0"/>
                        <span className="text-sm text-primary">
                            {t.rich('connect_modrinth.desc', {
                              b: (chunks: any) => <span className="font-medium">{chunks}</span>
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
