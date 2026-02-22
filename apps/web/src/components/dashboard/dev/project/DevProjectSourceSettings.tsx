'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@repo/ui/components/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@repo/ui/components/input";
import {Button} from "@repo/ui/components/button";
import {ExternalLinkIcon, LightbulbIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {projectUpdateSourceSchema} from "@/lib/forms/schemas";
import * as React from "react";
import {useState} from "react";
import {toast} from "sonner";
import {useRouter} from "@/lib/locales/routing";
import {DevProject} from "@repo/shared/types/service";
import clientActions from "@/lib/forms/clientActions";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

function ProjectSourceFormBody({form}: { form: any }) {
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="repo"
        render={({field}) => (
          <FormItem>
            <FormLabel>
              Repository URL
            </FormLabel>
            <FormControl>
              <Input placeholder="https://github.com/ExampleUser/ExampleMod" {...field} />
            </FormControl>
            <FormDescription>
              This is the address you use to clone your repository.
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
              Branch
            </FormLabel>
            <FormControl>
              <Input placeholder="main" {...field} />
            </FormControl>
            <FormDescription>
              Primary branch name. You can specify additional branches to include in your metadata file.
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
              Path to documentation root
            </FormLabel>
            <FormControl>
              <Input placeholder="/docs" {...field} />
            </FormControl>
            <FormDescription>
              Path to the folder containing the metadata file.
            </FormDescription>
            <FormMessage/>
          </FormItem>
        )}
      />
    </div>
  )
}

export default function DevProjectSourceSettings({project}: { project: DevProject }) {
  const form = useForm<z.infer<typeof projectUpdateSourceSchema>>({
    resolver: zodResolver(projectUpdateSourceSchema),
    defaultValues: {
      id: project.id,
      repo: project.source_repo,
      branch: project.source_branch,
      path: project.source_path,
      is_community: false
    },
  });

  const t = useTranslations('ProjectRegisterForm');
  const u = useTranslations('FormActions');
  const v = useTranslations('DevProjectSourceSettingsPage');
  const [canVerifyModrinth, setCanVerifyModrinth] = useState(false);
  const router = useRouter();

  const action: () => void = form.handleSubmit(async (data) => {
    let resolver: any = null;
    let rejector: any = null;
    const promise = new Promise((resolve, reject) => {
      resolver = () => resolve({});
      rejector = () => reject();
    });
    toast.promise(promise, {
      loading: 'Updating project...',
      description: t('submission.note'),
      success: 'Project updated successfully',
      error: 'Error updating project',
    });
    const resp = await clientActions.handleEditProjectFormClient(data) as any;
    if (resp.success) resolver();
    else rejector();

    if (resp.success) {
      router.refresh();
    } else if (resp.error) {
      // @ts-expect-error expected
      form.setError('root.custom', {message: u(`errors.${resp.error}`), details: resp.details});
      setCanVerifyModrinth(resp.can_verify_mr && resp.error === 'ownership');
    } else if (resp.errors) {
      for (const key in resp.errors) {
        // @ts-expect-error expected
        form.setError(key, {message: u(`errors.${resp.errors[key][0]}`)});
      }
    }
    return resp;
  });

  return (
    <Form {...form}>
      <form action={action} className="mt-4 flex h-full flex-col space-y-5">
        <ProjectSourceFormBody form={form}/>

        <div className="ml-auto w-fit">
          <Button type="submit">
            {v('save')}
          </Button>
        </div>

        <div>
          {form.formState.errors.root?.custom?.message &&
            <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
                <p className="text-sm text-destructive">
                  {form.formState.errors.root.custom.message}
                </p>
            </div>
          }

          {/*@ts-expect-error expected*/}
          {form.formState.errors.root?.custom?.details &&
            <details className="slim-scrollbar max-h-20 w-fit overflow-y-auto text-sm text-destructive">
                <summary className="mb-2">
                  {t('errors.details')}
                </summary>
              {/*@ts-expect-error expected*/}
                <code className="text-xs">{form.formState.errors.root.custom.details}</code>
            </details>
          }

          {canVerifyModrinth &&
            <div className="flex flex-col gap-1 rounded-md border border-info/70 p-3">
                <p className="flex flex-row items-start text-secondary">
                    <LightbulbIcon className="mt-0.5 mr-2 inline-block h-4 w-4 shrink-0"/>
                    <span className="text-sm text-secondary">
                            {t.rich('connect_modrinth.desc', {
                              b: (chunks: any) => <span className="text-primary">{chunks}</span>
                            })}
                        </span>
                </p>
                <div className="ml-auto">
                    <LocaleNavLink href="/dev/settings" target="_blank">
                        <Button type="button" size="sm">
                          {t('connect_modrinth.settings')}
                            <ExternalLinkIcon className="ml-2 h-4 w-4"/>
                        </Button>
                    </LocaleNavLink>
                </div>
            </div>
          }
        </div>
      </form>
    </Form>
  );
}