import * as React from "react";
import {TableColumn, TableRouteParams} from "@repo/ui/blocks/data-table/dataTableTypes";
import DataTable from "@repo/ui/blocks/data-table/DataTable";
import {ProjectReport, ProjectReports} from "@repo/shared/types/api/moderation";
import {useTranslations} from "next-intl";

export default function AdminReportsTable({data, page, params}: {
  data: ProjectReports;
  params: TableRouteParams;
  page: number;
}) {
  const t = useTranslations('ProjectReportReason');
  const u = useTranslations('ProjectReportStatus');

  const columns: TableColumn<ProjectReport>[] = [
    {
      id: 'id',
      header: 'ID',
      cell: report => (
        <span>{report.id.substring(0, 10)}</span>
      )
    },
    {
      id: 'project_id',
      header: 'Project',
      cell: report => (
        <span>{report.project_id}</span>
      )
    },
    {
      id: 'reason',
      header: 'Reason',
      cell: report => (
        <span>{t(report.reason)}</span>
      )
    },
    {
      id: 'submitter_id',
      header: 'Submitter',
      cell: report => (
        <span>{report.submitter_id}</span>
      )
    },
    {
      id: 'status',
      header: 'Status',
      cell: report => (
        <span>{u(report.status)}</span>
      )
    },
    {
      id: 'created_at',
      header: 'Created at',
      cell: report => (
        <span>{report.created_at}</span>
      )
    },
  ];

  return (
    <DataTable columns={columns} data={data} params={params} page={page}
               linker={r => `reports/${encodeURIComponent(r.id)}`}/>
  )
}