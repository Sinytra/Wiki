'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {DialogFooter} from "@repo/ui/components/dialog";
import * as React from "react";
import {toast} from "sonner";
import {Input} from "@repo/ui/components/input";
import SubmitButton from "@/components/util/SubmitButton";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@repo/ui/components/select";
import {CompassIcon} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {Textarea} from "@repo/ui/components/textarea";
import {flushSync} from "react-dom";
import {useTranslations} from "next-intl";
import {projectReportSchema} from "@/lib/forms/schemas";
import {ProjectReportType} from "@repo/shared/types/api/moderation";

interface Properties {
  projectId: string;
  type: ProjectReportType;
  path: string | null;
  locale: string | null;
  version: string | null;
  formAction: (data: any) => Promise<any>;
}

export default function ProjectReportForm({projectId, type, version, locale, path, formAction}: Properties) {
  const t = useTranslations('Report.form');
  const u = useTranslations('ProjectReportReason');
  const form = useForm<z.infer<typeof projectReportSchema>>({
    resolver: zodResolver(projectReportSchema),
    defaultValues: {
      project_id: projectId,
      type,
      path: path ? '/' + path : undefined,
      version: version ?? undefined,
      locale: locale ?? undefined
    }
  });
  const reason = form.watch('reason');
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await formAction(data);
    if (resp.success) {
      toast.success(t('success'));
      flushSync(() => form.reset());
    } else if (resp.error) {
      form.setError('root.custom', {message: resp.error});
    } else if (resp.errors) {
      for (const key in resp.errors) {
        // @ts-ignore
        form.setError(key, {message: resp.errors[key][0]});
      }
    }
    return resp;
  });

  return (
    <Form {...form}>
      <form tabIndex={0} action={action} className="space-y-6 focus:outline-hidden">
        <FormItem>
          <FormLabel>
            {t('id.title')}
          </FormLabel>
          <FormControl>
            <Input placeholder="examplemod" value={projectId} disabled/>
          </FormControl>
          <FormDescription>
            {t('id.desc')}
          </FormDescription>
          <FormMessage/>
        </FormItem>

        <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full [&>div]:w-full">
          <FormField
            control={form.control}
            name="locale"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  {t('locale.title')}
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled placeholder={t('locale.placeholder')}/>
                </FormControl>
                <FormDescription>
                  {t('locale.desc')}
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  {t('version.title')}
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled placeholder={t('version.placeholder')}/>
                </FormControl>
                <FormDescription>
                  {t('version.desc')}
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="path"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                {t('path.title')}
              </FormLabel>
              <FormControl>
                <Input {...field} disabled/>
              </FormControl>
              <FormDescription>
                {t('path.desc')}
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                {t('reason.title')}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('reason.placeholder')}/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="spam">{u('spam')}</SelectItem>
                  <SelectItem value="copyright">{u('copyright')}</SelectItem>
                  <SelectItem value="tos">{u('tos')}</SelectItem>
                  <SelectItem value="content_rules">{u('content_rules')}</SelectItem>
                  <SelectItem value="dislike">{t('reason.dislike')}</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t('reason.desc')}
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />

        {reason !== 'dislike' &&
          <FormField
            control={form.control}
            name="body"
            disabled={!reason}
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  {t('details.title')}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('details.placeholder')}
                    className="resize-none"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>
                  {t('details.desc')}
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
        }

        {form.formState.errors.root?.custom?.message &&
          <p className="text-destructive text-sm">{form.formState.errors.root.custom.message}</p>
        }

        {reason === 'dislike'
          ?
          <div className="flex flex-col text-sm">
            {t('dislike.title')}
            &nbsp;{t('dislike.desc')}
            <p className="my-1"/>
            {t('dislike.suggestion')}

            <Button asChild className="mt-4 ml-auto">
              <LocaleNavLink href="/browse">
                <CompassIcon className="mr-2 h-4 w-4"/>
                {t('dislike.explore')}
              </LocaleNavLink>
            </Button>
          </div>
          :
          <DialogFooter>
            <SubmitButton/>
          </DialogFooter>
        }
      </form>
    </Form>
  )
}
