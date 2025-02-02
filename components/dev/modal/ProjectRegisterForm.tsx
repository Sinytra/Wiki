'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
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
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {projectRegisterSchema} from "@/lib/forms/schemas";
import {Input} from "@/components/ui/input";
import SubmitButton from "@/components/dev/SubmitButton";
import {useTranslations} from "next-intl";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";
import {ExternalLinkIcon, LightbulbIcon, Loader2Icon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Link, useRouter} from "@/lib/locales/routing";
import {useRouter as useProgressRouter} from "next-nprogress-bar";
import clientUtil from "@/lib/util/clientUtil";
import {useParams} from "next/navigation";

export interface ProjectRegisterFormProps {
  defaultValues: any;
  isAdmin: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  translations?: string;
  trigger?: any;
  schema: any;
  redirectToProject?: boolean;
  reloadAfterSubmit?: boolean;

  formAction: (data: any) => Promise<any>
}

export default function ProjectRegisterForm(
  {
    open,
    setOpen,
    defaultValues,
    isAdmin,
    formAction,
    translations,
    trigger,
    schema,
    redirectToProject,
    reloadAfterSubmit
  }: ProjectRegisterFormProps
) {
  const params = useParams();
  const progressRouter = useProgressRouter();
  const router = useRouter();

  // @ts-ignore
  const v = useTranslations(translations || 'ProjectRegisterForm');
  const t = useTranslations('ProjectRegisterForm');
  const u = useTranslations('FormActions');
  const reload = clientUtil.usePageDataReloadTransition();

  const form = useForm<z.infer<typeof projectRegisterSchema>>({
    resolver: zodResolver(schema),
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
      // @ts-ignore
      form.setError('root.custom', {message: u(`errors.${resp.error}`), details: resp.details});
      setCanVerifyModrinth(resp.can_verify_mr && resp.error === 'ownership');
    } else if (resp.errors) {
      for (const key in resp.errors) {
        // @ts-ignore
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
      {trigger &&
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      }
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
          <div className="focus:outline-hidden relative" tabIndex={0}>
            {form.formState.isSubmitting &&
              <div
                className="inline-flex gap-2 items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Loader2Icon className="mr-2 h-6 w-6 animate-spin"/>
                  <span className="text-lg">{t('submitting')}</span>
              </div>
            }
            <form ref={formRef} action={action}
                  className={cn('focus:outline-hidden space-y-6', form.formState.isSubmitting && 'invisible')}>
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
                <div className="flex flex-col gap-2 sm:flex-row items-center justify-between w-full">
                    <p className="text-destructive text-sm">
                      {form.formState.errors.root.custom.message}
                    </p>
                </div>
              }

              {/*@ts-ignore*/}
              {form.formState.errors.root?.custom?.details &&
                <details className="w-fit text-sm text-destructive max-h-20 overflow-y-auto slim-scrollbar">
                    <summary className="mb-2">
                      {t('errors.details')}
                    </summary>
                  {/*@ts-ignore*/}
                    <code className="text-xs">{form.formState.errors.root.custom.details}</code>
                </details>
              }

              {canVerifyModrinth &&
                <div className="flex flex-col gap-1 p-3 border border-info rounded-md">
                    <p className="flex flex-row items-start text-secondary">
                        <LightbulbIcon className="inline-block shrink-0 mt-0.5 mr-2 h-4 w-4"/>
                        <span className="text-secondary text-sm">
                            {t.rich('connect_modrinth.desc', {
                              b: (chunks) => <span className="text-primary">{chunks}</span>
                            })}
                        </span>
                    </p>
                    <div className="ml-auto">
                        <Link href="/dev/settings" target="_blank">
                            <Button variant="outline" type="button" size="sm">
                                {t('connect_modrinth.settings')}
                                <ExternalLinkIcon className="w-4 h-4 ml-2"/>
                            </Button>
                        </Link>
                    </div>
                </div>
              }

              <DialogFooter className="flex flex-row w-full">
                <SubmitButton t={{title: t('submit')}}/>
              </DialogFooter>
            </form>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
