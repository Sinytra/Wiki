import {getTranslations} from "next-intl/server";
import {setContextLocale} from "@/lib/locales/routing";
import {useTranslations} from "next-intl";
import * as React from "react";
import DevProjectPageTitle from "@/components/dev/project/DevProjectPageTitle";
import {AlertCircleIcon, ShieldCheckIcon, TriangleAlertIcon} from "lucide-react";
import DevProjectSectionTitle from "@/components/dev/project/DevProjectSectionTitle";
import {cn} from "@repo/ui/lib/utils";
import ProjectIssuesList from "@/components/dev/project/ProjectIssuesList";
import {handleApiCall} from "@/lib/service/serviceUtil";
import devProjectApi from "@/lib/service/api/devProjectApi";
import {ProjectIssue, ProjectIssueStats} from "@repo/shared/types/api/project";
import issuesApi from "@repo/shared/api/issuesApi";

function ProjectIssuesStatWidget({className, count, title, icon: Icon}: {
  title: string;
  count: number;
  icon: any;
  className?: string
}) {
  return (
    <div className={cn(
      'flex w-36 flex-row items-center justify-between gap-2 rounded-sm border px-2.5 py-1.5',
      count > 0 ? className : 'border-secondary-dim bg-primary-dim text-secondary'
    )}>
      <div className="flex flex-row items-center gap-2">
        <Icon className="size-4"/>
        <span className="text-sm">
          {title}
        </span>
      </div>
      <span className="text-sm">
        {count}
      </span>
    </div>
  )
}

function ProjectIssuesHealthWidget({stats}: { stats: ProjectIssueStats }) {
  const styles = {
    error: {
      class: 'text-destructive bg-destructive-soft/50 border-destructive',
      iconClass: '',
      icon: AlertCircleIcon,
      text: 'Project has errors'
    },
    warning: {
      class: 'text-warning-soft bg-warning-soft/50 border-warning-soft',
      iconClass: '',
      icon: TriangleAlertIcon,
      text: 'Project has warnings'
    },
    normal: {
      class: 'text-secondary bg-primary-dim border-secondary',
      iconClass: 'text-success',
      icon: ShieldCheckIcon,
      text: 'No issues found'
    }
  };
  const style = styles[stats.error > 0 ? 'error' : stats.warning > 0 ? 'warning' : 'normal'];
  const Icon = style.icon;

  return (
    <div className={cn(style.class, 'flex flex-row items-center gap-2 rounded-sm border px-2.5 py-1.5')}>
      <div className={cn(style.iconClass)}>
        <Icon className="size-4"/>
      </div>
      <span className="text-sm">
        {style.text}
      </span>
    </div>
  )
}

function ProjectIssuesSummary({stats}: { stats: ProjectIssueStats }) {
  return (
    <div className="flex w-full flex-row gap-4">
      <div className="mr-auto">
        <ProjectIssuesHealthWidget stats={stats}/>
      </div>

      <ProjectIssuesStatWidget
        title="Warnings"
        className="border-warning-soft bg-[var(--vp-c-warning-soft)]/50 text-warning-soft"
        count={stats.warning || 0}
        icon={TriangleAlertIcon}
      />
      <ProjectIssuesStatWidget
        title="Errors"
        className="border-destructive bg-destructive-soft/50 text-destructive"
        count={stats.error || 0}
        icon={AlertCircleIcon}
      />
    </div>
  )
}

function ProjectIssuesSection({issues}: { issues: ProjectIssue[] }) {
  const t = useTranslations('DevProjectHealthPage.errors');

  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-sm">
      {issues.length > 0 ?
        <ProjectIssuesList issues={issues}/>
        : (
          <div className={`
            flex w-full flex-col items-center gap-3 rounded-sm border border-secondary-dim bg-primary-dim py-8
            text-secondary
          `}>
            <ShieldCheckIcon className="size-8"/>
            <span>{t('empty')}</span>
          </div>
        )}
    </div>
  )
}

export default async function DevProjectHealthPage(props: { params: Promise<{ locale: string; project: string }> }) {
  const params = await props.params;
  setContextLocale(params.locale);
  const t = await getTranslations('DevProjectHealthPage');
  const project = handleApiCall(await devProjectApi.getProject(params.project));
  const issues = handleApiCall(await issuesApi.getProjectIssues(params.project));

  return (
    <div className="flex h-full flex-col gap-y-4 pt-1">
      <DevProjectPageTitle title={t('title')} desc={t('desc')}/>

      <DevProjectSectionTitle title={t('errors.title')} desc={t('errors.desc')}/>

      <ProjectIssuesSummary stats={project.issue_stats || {} as ProjectIssueStats}/>

      <div className="mt-4 flex h-full flex-col gap-y-4">
        <DevProjectSectionTitle
          title="Issue details"
          desc="Below you can find a list of all ongoing project issues. To resolve them, make appropriate changes to your project and then create a new deployment to apply the fixes."
        />

        <ProjectIssuesSection issues={issues}/>
      </div>
    </div>
  )
}