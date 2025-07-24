import {Link, setContextLocale} from "@/lib/locales/routing";
import {handleApiCall} from "@/lib/service/serviceUtil";
import moderationApi from "@/lib/service/api/moderationApi";
import {getTranslations} from "next-intl/server";
import {BreadcrumbLink, BreadcrumbPage} from "@repo/ui/components/breadcrumb";
import DevBreadcrumb from "@/components/dev/navigation/DevBreadcrumb";
import {ProjectReport} from "@repo/shared/types/api/moderation";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import * as React from "react";
import {Label} from "@repo/ui/components/label";
import {Input} from "@repo/ui/components/input";
import {useTranslations} from "next-intl";
import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";
import {Textarea} from "@repo/ui/components/textarea";
import RuleReportForm from "@/components/admin/report/RuleReportForm";
import {handleRuleProjectReport} from "@/lib/forms/actions";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import navigation from "@/lib/navigation";

function ReportField({title, value}: { title: string; value: string | null }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label>{title}</Label>
      <Input value={value || 'N/A'} disabled={!value} readOnly/>
    </div>
  )
}

function ReportDetails({report}: { report: ProjectReport }) {
  const t = useTranslations('ViewReportPage.details');
  const u = useTranslations('ProjectReportReason');
  const v = useTranslations('ProjectReportStatus');
  const x = useTranslations('ProjectReportType');

  return (
    <ClientLocaleProvider keys={['ViewReportPage']}>
      <RuleReportForm disabled={report.status !== 'new'} formAction={handleRuleProjectReport.bind(null, report.id)}>
        <div className="flex w-full flex-row flex-wrap gap-4">
          <LocaleNavLink href={navigation.getProjectLink(report.project_id)} className={`
            grid w-full max-w-sm items-center gap-3
          `}>
            <Label>{t('project_id')}</Label>
            <Input value={report.project_id} className="cursor-pointer" readOnly/>
          </LocaleNavLink>

          <ReportField title={t('reporter')} value={report.submitter_id} />
          <ReportField title={t('type')} value={x(report.type)} />
          <ReportField title={t('version')} value={report.version} />
          <ReportField title={t('locale')} value={report.locale} />
          <ReportField title={t('path')} value={report.path} />
          <ReportField title={t('reason')} value={u(report.reason)} />
          <ReportField title={t('status')} value={v(report.status)} />
          <ReportField title={t('created_at')} value={report.created_at} />
        </div>

        <div className="grid w-full items-center gap-3">
          <Label>{t('body')}</Label>
          <Textarea className="min-h-48 bg-primary-dim" value={report.body} readOnly/>
        </div>
      </RuleReportForm>
    </ClientLocaleProvider>
  )
}

export default async function ViewReportPage(props: { params: Promise<{ locale: string; report: string; }> }) {
  const params = await props.params;
  setContextLocale(params.locale);

  const t = await getTranslations('ViewReportPage');
  const report = handleApiCall(await moderationApi.getProjectReport(params.report));

  return (
    <div>
      <DevBreadcrumb home={
        <BreadcrumbLink asChild>
          <Link href="/admin/reports">
            {t('reports')}
          </Link>
        </BreadcrumbLink>
      }>
        <BreadcrumbPage className="font-mono text-xsm text-primary">
          {params.report}
        </BreadcrumbPage>
      </DevBreadcrumb>

      <DevProjectPageTitle title={t('title')} desc={t('desc', {id: report.id})}/>

      <div className="mt-6">
        <ReportDetails report={report}/>
      </div>
    </div>
  )
}