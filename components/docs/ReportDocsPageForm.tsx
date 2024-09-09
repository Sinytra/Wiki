'use client'

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {DialogFooter} from "@/components/ui/dialog";
import {handleReportProjectForm} from "@/lib/forms/actions";
import * as React from "react";
import {toast} from "sonner";
import {docsPageReportSchema} from "@/lib/forms/schemas";
import {Input} from "@/components/ui/input";
import SubmitButton from "@/components/dev/SubmitButton";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CompassIcon} from "lucide-react";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {Textarea} from "@/components/ui/textarea";
import {flushSync} from "react-dom";

export default function ReportDocsPageForm({projectId, path}: { projectId: string, path: string }) {
  const handler = handleReportProjectForm.bind(null, projectId, path);
  const form = useForm<z.infer<typeof docsPageReportSchema>>({
    resolver: zodResolver(docsPageReportSchema),
    defaultValues: {}
  });
  const reason = form.watch('reason');
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await handler(data) as any;
    if (resp.success) {
      toast.success('Report submitted successfully');
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
      <form tabIndex={0} action={action} className="focus:outline-none space-y-6">
        <FormItem>
          <FormLabel>Project ID</FormLabel>
          <FormControl>
            <Input placeholder="examplemod" value={projectId} disabled/>
          </FormControl>
          <FormDescription>
            Reported project ID.
          </FormDescription>
          <FormMessage/>
        </FormItem>

        <FormItem>
          <FormLabel>Page path</FormLabel>
          <FormControl>
            <Input placeholder="/blocks/generator" value={`/${path}`} disabled/>
          </FormControl>
          <FormDescription>
            Reported documentation page path.
          </FormDescription>
          <FormMessage/>
        </FormItem>

        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Reply email address</FormLabel>
              <FormControl>
                <Input placeholder="contact@example.com" {...field} />
              </FormControl>
              <FormDescription>
                (Optional) Contact email address we can use to inform you about updates on this report, or to request
                additional information.
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
              <FormLabel>Reason*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason for reporting this page"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="copyright">Copyright Infringement</SelectItem>
                  <SelectItem value="content_rules_violation">Violates Content Rules</SelectItem>
                  <SelectItem value="tos_violation">Violates Terms of Service</SelectItem>
                  <SelectItem value="dislike">I just don't like it</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Reason for reporting this page.
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
                    <FormLabel>Details*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide more details on why you're reporting this page. Note that empty reports will be ignored."
                        className="resize-none"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional details about the issue.
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
            We understand that you may not like this page, and that's totally okay!
            Unfortunately, however, it is not a valid reason to report a project.
            <p className="my-1"/>
            Would you like to look for something else to read instead?

            <Button asChild className="mt-4 ml-auto text-primary-foreground">
              <LocaleNavLink href="/browse">
                <CompassIcon className="w-4 h-4 mr-2"/>
                Explore mods
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
