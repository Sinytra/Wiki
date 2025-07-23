'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import * as React from "react";
import {useTranslations} from "next-intl";
import {AccessKeyCreationResult} from "@/lib/service/api/adminApi";
import {Button} from "@repo/ui/components/button";
import {LockIcon} from "lucide-react";
import DataField from "@/components/util/DataField";

export interface CreateAccessKeyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  result: AccessKeyCreationResult | null;
}

export default function SaveAccessKeyModal({result, open, setOpen}: CreateAccessKeyModalProps) {
  const t = useTranslations('SaveAccessKeyModal');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="outline-hidden!">
        <DialogHeader>
          <DialogTitle>
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('desc')}
          </DialogDescription>
        </DialogHeader>

        {result &&
          <div className="my-4 flex w-full min-w-0">
            <DataField title={t('key')} desc={t('note')}
                       icon={LockIcon} copiable value={result.token}/>
          </div>
        }

        {result?.key?.expires_at &&
          <span className="text-sm text-secondary">
            {t('valid', { expiry: result.key.expires_at })}
          </span>
        }

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={event => event.stopPropagation()}>
              {t('close')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
