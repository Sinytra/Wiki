'use client'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
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
import {useFormStatus} from 'react-dom';
import {Loader2Icon} from "lucide-react";
import {useState} from "react";
import {toast} from "sonner";
import {projectRegisterSchema} from "@/lib/forms/schemas";

function SubmitButton() {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      Submit
    </Button>
  );
}

export function ProjectRegisterForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof projectRegisterSchema>>({
    resolver: zodResolver(projectRegisterSchema)
  });
  const action: () => void = form.handleSubmit(async (data) => {
    const resp = await handleEnableProjectForm(data);
    if (resp.success) {
      setOpen(false);
      form.reset();
      toast.success('Project registered successfully', {
        description: 'You can now navigate to the project\'s mod page'
      })
    } else {
      for (const key in resp.errors) {
        // @ts-ignore
        form.setError(key, {message: resp.errors[key][0]});
      }
    }
    return resp;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Enable</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register project</DialogTitle>
          <DialogDescription>
            Register a new project to the wiki.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form tabIndex={0} action={action} className="space-y-6">
            {/*<FormField
              control={form.control}
              name="source"
              render={({field}) => (
                <FormItem className="space-y-3">
                  <FormLabel>Source Platform</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}
                                className="flex flex-row gap-8">
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="modrinth"/>
                        </FormControl>
                        <FormLabel className="font-normal">
                          Modrinth
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem disabled value="curseforge"/>
                        </FormControl>
                        <FormLabel className="font-normal">
                          CurseForge
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Project ID</FormLabel>
                  <FormControl>
                    <Input placeholder="examplemod" {...field} />
                  </FormControl>
                  <FormDescription>
                    The selected platform project's ID / slug.
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />*/}

            {/*TODO Replace with repo, branch and path selector*/}
            <FormField
              control={form.control}
              name="source_url"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Project ID</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/Example/ExampleMod/tree/main/docs" {...field} />
                  </FormControl>
                  <FormDescription>
                    The documentation source root. Must be a valid GitHub tree URL.
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <DialogFooter>
              <SubmitButton/>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
