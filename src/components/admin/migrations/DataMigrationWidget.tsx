'use client'

import {DataMigration} from "@repo/shared/types/api/admin";
import {Button} from "@repo/ui/components/button";
import {SettingsIcon} from "lucide-react";
import * as React from "react";
import {toast} from "sonner";
import {ApiCallResult} from "@repo/shared/network";

export default function DataMigrationWidget({migration, action}: { migration: DataMigration, action: () => Promise<ApiCallResult> }) {
  const formAction = async () => {
    let resolver: any = null;
    let rejector: any = null;
    const promise = new Promise((resolve, reject) => {
      resolver = () => resolve({});
      rejector = () => reject();
    });

    toast.promise(promise, {
      loading: 'Running Data Migration',
      success: 'Data Migration Successful',
      error: 'Data Migration Failed'
    });

    const result = await action();
    if (result.success) {
      resolver();
    } else {
      rejector();
    }
  }

  return (
    <form action={formAction}
          className="flex flex-row items-center justify-between rounded-sm border border-tertiary bg-primary-dim p-3"
    >
      <div className="flex flex-col gap-1">
        <span className="text-base font-medium">{migration.title}</span>
        <span className="text-sm text-secondary">{migration.desc}</span>
      </div>

      <Button size="sm">
        <SettingsIcon className="mr-2 size-4" />
        Run
      </Button>
    </form>
  );
}