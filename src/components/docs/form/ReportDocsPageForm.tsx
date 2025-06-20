'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@repo/ui/components/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@repo/ui/components/form";
import {DialogFooter} from "@repo/ui/components/dialog";
import * as React from "react";
import {toast} from "sonner";
import {docsPageReportSchema} from "@/lib/forms/schemas";
import {Input} from "@repo/ui/components/input";
import SubmitButton from "@/components/util/SubmitButton";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@repo/ui/components/select";
import {CompassIcon} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {Textarea} from "@repo/ui/components/textarea";
import {flushSync} from "react-dom";

interface Properties {
  projectId: string;
  path: string;
  t: any;
  submitT: any;
  formAction: (data: any) => Promise<any>;
}

export default function ReportDocsPageForm({projectId, path, t, submitT, formAction}: Properties) {
  const form = useForm<z.infer<typeof docsPageReportSchema>>({
    resolver: zodResolver(docsPageReportSchema),
    defaultValues: {}
  });
  const reason = form.watch('reason');
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await formAction(data);
    if (resp.success) {
      toast.success(t.success);
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
            {t.id.title}
          </FormLabel>
          <FormControl>
            <Input placeholder="examplemod" value={projectId} disabled/>
          </FormControl>
          <FormDescription>
            {t.id.desc}
          </FormDescription>
          <FormMessage/>
        </FormItem>

        <FormItem>
          <FormLabel>
            {t.path.title}
          </FormLabel>
          <FormControl>
            <Input placeholder="/blocks/generator" value={path && `/${path}`} disabled/>
          </FormControl>
          <FormDescription>
            {t.path.desc}
          </FormDescription>
          <FormMessage/>
        </FormItem>

        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                {t.email.title}
              </FormLabel>
              <FormControl>
                <Input placeholder="contact@example.com" {...field} />
              </FormControl>
              <FormDescription>
                {t.email.desc}
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
                {t.reason.title}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t.reason.placeholder}/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="spam">{t.reason.spam}</SelectItem>
                  <SelectItem value="copyright">{t.reason.copyright}</SelectItem>
                  <SelectItem value="content_rules_violation">{t.reason.content_rules_violation}</SelectItem>
                  <SelectItem value="tos_violation">{t.reason.tos_violation}</SelectItem>
                  <SelectItem value="dislike">{t.reason.dislike}</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t.reason.desc}
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />

        {reason !== 'dislike' &&
            <FormField
                control={form.control}
                name="content"
                disabled={!reason}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      {t.details.title}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.details.placeholder}
                        className="resize-none"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>
                      {t.details.desc}
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
            {t.dislike.title}
            &nbsp;{t.dislike.desc}
            <p className="my-1"/>
            {t.dislike.suggestion}

            <Button asChild className="text-inverse mt-4 ml-auto">
              <LocaleNavLink href="/browse">
                <CompassIcon className="mr-2 h-4 w-4"/>
                {t.dislike.explore}
              </LocaleNavLink>
            </Button>
          </div>
          :
          <DialogFooter>
            <SubmitButton t={submitT}/>
          </DialogFooter>
        }
      </form>
    </Form>
  )
}
