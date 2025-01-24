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
import {startTransition, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {projectRegisterSchema} from "@/lib/forms/schemas";
import {Input} from "@/components/ui/input";
import LinkTextButton from "@/components/ui/link-text-button";
import SubmitButton from "@/components/dev/SubmitButton";
import {useTranslations} from "next-intl";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";
import {CheckIcon, Loader2Icon} from "lucide-react";
import {modrinthAuthScopes, modrinthCallbackURL, modrinthOAuthClient} from "@/lib/auth";
import {Button} from "@/components/ui/button";
import {useRouter} from "@/lib/locales/routing";
import {useRouter as useProgressRouter} from "next-nprogress-bar";
import ModrinthIcon from "@/components/ui/icons/ModrinthIcon";
import clientUtil from "@/lib/util/clientUtil";
import {useParams, usePathname} from "next/navigation";

export interface ProjectRegisterFormProps {
  defaultValues: any;
  state?: any;
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

export interface RepoInstallationState {
  owner: string;
  repo: string;
  branch: string | null;
  path: string | null;
}

export default function ProjectRegisterForm(
    {
      open,
      setOpen,
      defaultValues,
      state,
      isAdmin,
      formAction,
      translations,
      trigger,
      schema,
      redirectToProject,
      reloadAfterSubmit
    }: ProjectRegisterFormProps
) {
  const openDefault = state !== undefined;
  const params = useParams();
  const progressRouter = useProgressRouter();
  const router = useRouter();
  const path = usePathname();

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
        startTransition(() => progressRouter.push(`/${params.locale}/dev/${resp.project.id}`));
      }

      setOpen(false);
      toast.success(v('success.title'), {description: v('success.desc')});

      if (reloadAfterSubmit) {
        reload(() => router.refresh());
      }
    } else if (resp.install_url) {
      form.setError('root.missing_installation', {message: resp.install_url});
    } else if (resp.error == 'insufficient_repo_perms') {
      // @ts-ignore
      form.setError('root.insufficient_repo_perms', {message: u(`errors.${resp.error}`)});
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
    setOpen(openDefault);
  }, []);

  useEffect(() => {
    if (open) {
      form.reset();
      setCanVerifyModrinth(false);
    }
  }, [form, open]);

  // Prints a warning in console. Might wanna find a better way that doesn't re-add the values every time the modal opens
  useEffect(() => {
    if (openDefault) {
      window.history.pushState({}, '', `/${params.locale}/dev`);

      setTimeout(() => {
        for (const value in state) {
          // @ts-ignore
          form.setValue(value, state[value]);
        }
      });
    }
  }, [form, openDefault, state]);

  async function verifyUsingModrinth() {
    const state = btoa(JSON.stringify(form.getValues() satisfies RepoInstallationState));
    window.location.href = await modrinthOAuthClient.authorizationCode.getAuthorizeUri({
      redirectUri: modrinthCallbackURL,
      scope: modrinthAuthScopes,
      state
    });
  }

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
                <div className="flex flex-row items-center gap-2 w-full">
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

                {form.formState.errors?.root?.insufficient_repo_perms?.message &&
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.root.insufficient_repo_perms.message}
                    </p>
                }

                {form.formState.errors?.root?.missing_installation?.message &&
                    <p className="text-destructive text-sm">
                      {t.rich('errors.install_app', {
                        link: (chunks) => (
                            <LinkTextButton className="text-destructive! font-medium! underline"
                                            href={form.formState.errors.root!.missing_installation.message!}>
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
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                  <div>
                                    <FormLabel>
                                      {t('is_community.title')}
                                    </FormLabel>
                                  </div>
                                  <FormControl>
                                    <Switch className="mt-0!" checked={field.value} onCheckedChange={field.onChange}/>
                                  </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                }

                {form.formState.errors.root?.custom?.message &&
                    <div className="flex flex-col gap-2 sm:flex-row items-center justify-between w-full">
                        <p className="text-destructive text-sm">{form.formState.errors.root.custom.message}</p>
                      {canVerifyModrinth &&
                          <Button className="my-1 text-[var(--modrinth-brand)] border-[var(--modrinth-brand)]"
                                  variant="outline" type="button" onClick={verifyUsingModrinth}
                          >
                              <ModrinthIcon className="mr-2 w-4 h-4"/>
                            {t('verify_modrinth')}
                          </Button>
                      }
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

                <DialogFooter className="flex flex-row w-full">
                  {form.getValues().mr_code &&
                    <span className="mr-auto flex flex-row gap-2 items-center">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                            {t('mr_verified')}
                        </span>
                    </span>
                  }
                  <SubmitButton t={{title: t('submit')}}/>
                </DialogFooter>
              </form>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
  )
}
