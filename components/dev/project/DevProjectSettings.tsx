'use client'

import {DevProject} from "@/lib/service";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import ProjectDeleteForm from "@/components/dev/modal/ProjectDeleteForm";
import {CodeXmlIcon, ExternalLinkIcon, LightbulbIcon, TriangleAlertIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import {projectEditSchema} from "@/lib/forms/schemas";
import * as React from "react";
import {useState} from "react";
import {toast} from "sonner";
import {Link} from "@/lib/locales/routing";
import DevProjectSectionTitle from "@/components/dev/DevProjectSectionTitle";

function SourceSection({form}: { form: any }) {
  return (
    <div className="space-y-5">
      <DevProjectSectionTitle title="Source" desc="Project source repository coordinates." icon={CodeXmlIcon} />

      <hr/>

      <div className="space-y-6">
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
    </div>
  )
}

function DangerSection({deleteFunc}: { deleteFunc: any }) {
  return (
    <div className="space-y-5">
      <DevProjectSectionTitle title="Danger zone"
                     desc="These are destcructive actions. Proceed with caution."
                     icon={TriangleAlertIcon}
      />

      <hr/>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span>
              Delete project
            </span>
            <span className="text-secondary text-sm">
              Forever delete all project data. This cannot be undone.
            </span>
          </div>
          <div className="ml-auto sm:ml-0">
            <ProjectDeleteForm action={deleteFunc}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DevProjectSettings({project, formAction, deleteFunc}: { project: DevProject; formAction: (data: any) => Promise<any>; deleteFunc: any }) {
  const form = useForm<z.infer<typeof projectEditSchema>>({
    resolver: zodResolver(projectEditSchema),
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
  const [canVerifyModrinth, setCanVerifyModrinth] = useState(false);

  const action: () => void = form.handleSubmit(async (data) => {
    let resolver: any = null;
    let rejector: any = null;
    const promise = new Promise((resolve, reject) => {
      resolver = () => resolve({});
      rejector = () => reject();
    });
    toast.promise(promise, {
      loading: 'Updating project...',
      success: 'Project updated successfully',
      error: 'Error updating project',
    });
    const resp = await formAction(data) as any;
    if (resp.success) resolver();
    else rejector();

    if (resp.success) {
      // toast.success(v('success.title'), {description: v('success.desc')});

      // if (reloadAfterSubmit) {
      //   reload(() => router.refresh());
      // }
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

  return (
    <Form {...form}>
      <form action={action} className="flex flex-col h-full space-y-5">
        <SourceSection form={form}/>

        <div className="ml-auto w-fit">
          <Button type="submit">
            Save changes
          </Button>
        </div>

        <div>
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
            <div className="flex flex-col gap-1 p-3 border border-info/70 rounded-md">
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
                        <Button type="button" size="sm">
                          {t('connect_modrinth.settings')}
                            <ExternalLinkIcon className="w-4 h-4 ml-2"/>
                        </Button>
                    </Link>
                </div>
            </div>
          }
        </div>

        <hr className="border-secondary mt-auto"/>

        <DangerSection deleteFunc={deleteFunc}/>
      </form>
    </Form>
  );
}