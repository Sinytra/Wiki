'use client'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@repo/ui/components/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@repo/ui/components/button";
import {useTranslations} from "next-intl";
import {projectUpdateSchema} from "@/lib/forms/schemas";
import * as React from "react";
import {useRouter} from "@/lib/locales/routing";
import {DevProject, ProjectVisibility} from "@repo/shared/types/service";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@repo/ui/components/select";
import {FormActionResult, useFormHandlingAction} from "@/lib/forms/forms";
import {toast} from "sonner";

interface Props {
  project: DevProject;
  formAction: (data: any) => Promise<FormActionResult>;
}

function ProjectSettingsFormBody({form}: { form: any }) {
  const t = useTranslations('DevProjectSettingsPage.form');
  const u = useTranslations('ProjectVisibility');

  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="visibility"
        render={({field}) => (
          <FormItem>
            <FormLabel>
              {t('visibility.title')}
            </FormLabel>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <p className="w-full text-sm leading-5.5 text-wrap text-secondary">
                {t('visibility.public_desc')}<br/>
                {t('visibility.unlisted_desc')}<br/>
                {t('visibility.private_desc')}
              </p>
              <div className="sm:w-80">
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('visibility.placeholder')}/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {...[ProjectVisibility.PUBLIC, ProjectVisibility.UNLISTED, ProjectVisibility.PRIVATE].map(v => (
                      <SelectItem key={v} value={v}>{u(v)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FormMessage/>
          </FormItem>
        )}
      />
    </div>
  )
}

export default function DevProjectGeneralSettings({project, formAction}: Props) {
  const form = useForm<z.infer<typeof projectUpdateSchema>>({
    resolver: zodResolver(projectUpdateSchema),
    defaultValues: {
      visibility: project.visibility == ProjectVisibility.UNKNOWN ? undefined : project.visibility
    },
  });

  const t = useTranslations('FormActions');
  const u = useTranslations('DevProjectSettingsPage');
  const router = useRouter();

  const action = useFormHandlingAction(form, formAction, () => {
    toast.success(u('toast.success'));
    router.refresh();
  });

  return (
    <Form {...form}>
      <form action={action} className="mt-4 flex h-full flex-col space-y-5">
        <ProjectSettingsFormBody form={form}/>

        <div className="ml-auto w-fit">
          <Button type="submit">
            {u('save')}
          </Button>
        </div>

        {form.formState.errors.root?.custom?.message &&
          <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
              <p className="text-sm text-destructive">
                {form.formState.errors.root.custom.message}
              </p>
          </div>
        }
      </form>
    </Form>
  );
}