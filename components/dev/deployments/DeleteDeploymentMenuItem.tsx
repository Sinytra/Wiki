'use client'

import {DevProjectDeployment} from "@/lib/service/remoteServiceApi";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {LogOut, TrashIcon} from "lucide-react";
import * as React from "react";
import {useProgress} from "@bprogress/next";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";

export default function DeleteDeploymentMenuItem({deployment}: { deployment: DevProjectDeployment }) {
  const {start} = useProgress();

  const schema = z.object({});
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const [isOpen, setIsOpen] = useState(false);
  const action: () => void = form.handleSubmit(async (data) => {
    start();
    // await logoutAction(); TODO
  });

  return (
    <form action={action}>
      <button className="w-full appearance-none" type="submit">
        <DropdownMenuItem className="cursor-pointer">
          <span className="flex flex-row items-center text-destructive">
            <TrashIcon className="mr-2 size-3"/>
            Delete
          </span>
        </DropdownMenuItem>
      </button>
    </form>
  )
}