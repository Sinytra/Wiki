import {setContextLocale} from "@/lib/locales/routing";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import {getTranslations} from "next-intl/server";
import {handleApiCall} from "@/lib/service/serviceUtil";
import adminApi from "@/lib/service/api/adminApi";
import {handleDataMigration} from "@/lib/forms/adminForms";
import DataMigrationWidget from "@/components/admin/migrations/DataMigrationWidget";

type Properties = {
  params: Promise<{
    locale: string;
    project: string;
  }>
}

export default async function AdminMigrationsPage(props: Properties) {
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('AdminMigrations');

  const migrations = handleApiCall(await adminApi.getDataMigrations());

  return (
    <div className="space-y-3 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')} />

      {...migrations.map(migration => (
        <DataMigrationWidget key={migration.id} migration={migration}
                             action={handleDataMigration.bind(null, migration.id)} />
      ))}
    </div>
  )
}