'use client'

import {Button} from "@/components/ui/button";
import {Loader2Icon, RefreshCwIcon} from "lucide-react";
import {handleRevalidateDocs} from "@/lib/forms/actions";
import {toast} from "sonner";
import * as React from "react";
import {useState} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {useFormStatus} from "react-dom";
import LinkTextButton from "@/components/ui/link-text-button";

function DeleteButton() {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      Revalidate
    </Button>
  );
}

export default function ProjectRevalidateForm({id}: { id: string }) {
  const [open, setOpen] = useState(false);

  const actionWithSlug = handleRevalidateDocs.bind(null, id);

  const formAction = async () => {
    await actionWithSlug();
    setOpen(false);
    toast.success('Project successfully revalidated');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10 text-muted-foreground">
          <RefreshCwIcon className="w-4 h-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revalidate project?</DialogTitle>
          <DialogDescription className="!mt-4">
            All cached documentation pages will be purged and re-rendered lazily on-demand.

            <p className="mt-4">This option should only be used upon updating the documentation source itself.</p>

            <p className="mt-4">For your own convenience, we recommend automatically revalidating docs after publication
              using our <LinkTextButton target="_blank" href="/about" className="!font-normal !text-foreground">Gradle plugin</LinkTextButton> instead.</p>
          </DialogDescription>
        </DialogHeader>

        <form tabIndex={0} action={formAction} className="focus:outline-none space-y-6">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <DeleteButton/>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}