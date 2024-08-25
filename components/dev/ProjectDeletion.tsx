'use client'

import {Button} from "@/components/ui/button";
import {Loader2Icon, TrashIcon} from "lucide-react";
import {handleDeleteProjectForm} from "@/lib/forms/actions";
import {toast} from "sonner";
import * as React from "react";
import {useState} from "react";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {useFormStatus} from "react-dom";

function DeleteButton() {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" disabled={pending} variant="destructive" className="!text-destructive-foreground !bg-destructive">
      {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin"/>}
      Delete
    </Button>
  );
}

export default function ProjectDeletion({id}: { id: string }) {
  const [open, setOpen] = useState(false);

  const actionWithSlug = handleDeleteProjectForm.bind(null, id);

  const formAction = async () => {
    await actionWithSlug();
    setOpen(false);
    toast.success('Project deleted successfully');
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="w-9 h-9">
          <TrashIcon className="w-4 h-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>

        <form tabIndex={0} action={formAction} className="focus:outline-none space-y-6">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <DeleteButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}