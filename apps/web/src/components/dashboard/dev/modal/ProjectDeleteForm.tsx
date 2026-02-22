'use client'

import {Button} from "@repo/ui/components/button";
import {TrashIcon} from "lucide-react";
import * as React from "react";
import {useTranslations} from "next-intl";
import GenericDeleteModal from "@/components/modal/GenericDeleteModal";
import {FormActionResult} from "@/lib/forms/forms";

interface Properties {
  formAction: () => Promise<FormActionResult>;
  redirectTo?: string;
}

export default function ProjectDeleteForm({formAction, redirectTo}: Properties) {
  const t = useTranslations('ProjectDeleteForm');

  return (
    <GenericDeleteModal
      trigger={
        <Button variant="destructive" size="sm">
          <TrashIcon className="mr-2 h-4 w-4"/>
          <span>
            {t('trigger')}
          </span>
        </Button>
      }
      localeNamespace="ProjectDeleteForm"
      formAction={formAction}
      redirectTo={redirectTo}
    />
  )
}