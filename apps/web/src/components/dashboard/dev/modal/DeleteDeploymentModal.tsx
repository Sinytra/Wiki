'use client'

import {TrashIcon} from "lucide-react";
import * as React from "react";
import {useContext} from "react";
import {useTranslations} from "next-intl";
import {DropdownMenuItem} from "@repo/ui/components/dropdown-menu";
import {DropdownMenuContext} from "@/components/util/ContextDropdownMenu";
import GenericDeleteModal from "@/components/modal/GenericDeleteModal";
import {FormActionResult} from "@/lib/forms/forms";

interface Properties {
  loading: boolean;
  formAction: () => Promise<FormActionResult>;
  redirectTo?: string;
}

export default function DeleteDeploymentModal({formAction, loading, redirectTo}: Properties) {
  const t = useTranslations('DeleteDeploymentModal');
  const dropdownCtx = useContext(DropdownMenuContext);

  return (
    <GenericDeleteModal
      trigger={
        <DropdownMenuItem onClick={event => event.stopPropagation()}
                          onSelect={e => e.preventDefault()}
                          disabled={loading}
        >
          <span className="flex cursor-pointer flex-row items-center text-destructive">
            <TrashIcon className="mr-2 size-3"/>
            {t('trigger')}
          </span>
        </DropdownMenuItem>
      }
      localeNamespace="DeleteDeploymentModal"
      formAction={formAction}
      onOpenChange={(open) => dropdownCtx?.setModalOpen(open)}
      redirectTo={redirectTo}
    />
  )
}