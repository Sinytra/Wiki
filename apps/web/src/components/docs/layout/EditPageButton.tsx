import {useTranslations} from "next-intl";
import {Edit} from "lucide-react";
import * as React from "react";
import {NavLink} from "@/components/navigation/link/NavLink";

export default function EditPageButton({editUrl}: { editUrl?: string }) {
  const t = useTranslations('PageEditControls');

  return editUrl && (
    <NavLink href={editUrl} className={`
      flex items-center rounded-md border border-quaternary px-3 py-2 text-sm text-secondary hover:text-primary-alt
      sm:border-none sm:p-0
    `}>
      <Edit className="mr-2 h-4 w-4"/>
      {t('edit_gh')}
    </NavLink>
  )
}