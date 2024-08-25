'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button";
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
import {handleEnableProjectForm} from "@/lib/forms/actions";
import * as React from "react";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {projectRegisterSchema} from "@/lib/forms/schemas";
import {Input} from "@/components/ui/input";
import LinkTextButton from "@/components/ui/link-text-button";
import SubmitButton from "@/components/dev/SubmitButton";

export default function ProjectRegisterForm({defaultValues, state}: { defaultValues: any, state?: any }) {
  const openDefault = state !== undefined;
  const [open, setOpen] = useState(openDefault);

  const form = useForm<z.infer<typeof projectRegisterSchema>>({
    resolver: zodResolver(projectRegisterSchema),
    defaultValues: defaultValues
  });
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await handleEnableProjectForm(data) as any;
    if (resp.success) {
      setOpen(false);
      toast.success('Project registered successfully', {
        description: 'You can now navigate to the project\'s mod page'
      });
    } else if (resp.installation_url) {
      form.setError('root.not_installed', {message: resp.installation_url});
    } else if (resp.validation_error) {
      form.setError('root.validation_error', {message: resp.validation_error});
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

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  // Prints a warning in console. Might wanna find a better way that doesn't re-add the values every time the modal opens
  if (openDefault) {
    useEffect(() => {
      setTimeout(() => {
        for (const value in state) {
          // @ts-ignore
          form.setValue(value, state[value]);
        }
      });
    }, []);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register project</DialogTitle>
          <DialogDescription>
            Register a new project to the wiki.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form tabIndex={0} action={action} className="focus:outline-none space-y-6">
            <div className="flex flex-row items-center gap-2 w-full">
              <FormField
                control={form.control}
                name="owner"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="ExampleUser" {...field} />
                    </FormControl>
                    <FormDescription>
                      User / organization name.
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="ExampleMod" {...field} />
                    </FormControl>
                    <FormDescription>
                      Repository name.
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors?.root?.validation_error?.message &&
              <p className="text-sm font-medium text-destructive">{form.formState.errors.root.validation_error.message}</p>
            }

            {form.formState.errors?.root?.not_installed?.message &&
                <p className="text-destructive text-sm">
                    Please first install our GitHub app on your repository <LinkTextButton
                    className="!text-destructive !font-medium underline"
                    href={form.formState.errors.root.not_installed.message}>here</LinkTextButton>.
                </p>
            }

            <FormField
              control={form.control}
              name="branch"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <FormControl>
                    <Input placeholder="main" {...field} />
                  </FormControl>
                  <FormDescription>
                    Primary branch ref. You can specify additional branches to include in your metadata file.
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
                  <FormLabel>Path to documentation root</FormLabel>
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

            {form.formState.errors.root?.custom?.message &&
                <p className="text-destructive text-sm">{form.formState.errors.root.custom.message}</p>
            }

            <DialogFooter>
              <SubmitButton/>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}