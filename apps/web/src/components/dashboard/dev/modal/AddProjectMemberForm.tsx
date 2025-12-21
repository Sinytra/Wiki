'use client'

import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@repo/ui/components/form";
import * as React from "react";
import {addProjectMemberSchema} from "@/lib/forms/schemas";
import {Input} from "@repo/ui/components/input";
import {useTranslations} from "next-intl";
import {PlusIcon} from "lucide-react";
import {Button} from "@repo/ui/components/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@repo/ui/components/select";
import {ProjectMemberRole} from "@repo/shared/types/api/devProject";
import GenericFormModal from "@/components/modal/GenericFormModal";
import {FormActionResult} from "@/lib/forms/forms";

interface Props {
  formAction: (rawData: any) => Promise<FormActionResult>;
}

export default function AddProjectMemberForm({formAction}: Props) {
  const t = useTranslations('AddProjectMemberForm');
  const u = useTranslations('ProjectMemberRole');

  return (
    <GenericFormModal
      schema={addProjectMemberSchema}
      trigger={
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4"/>
          {t('button')}
        </Button>
      }
      localeNamespace="AddProjectMemberForm"
      formAction={formAction}
    >
      {(form) => (
        <>
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
        </>
      )}
    </GenericFormModal>
  )
}
