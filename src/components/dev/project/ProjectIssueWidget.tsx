'use client'

import {useTranslations} from "next-intl";
import {ChevronDown, CircleAlertIcon, TriangleAlertIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import * as React from "react";
import {useState} from "react";
import LocalDateTime from "@/components/util/LocalDateTime";
import {ProjectIssue, ProjectIssueLevel} from "@repo/shared/types/api/project";

export default function ProjectIssueWidget({issue}: { issue: ProjectIssue }) {
  const t = useTranslations('ProjectIssueType');
  const u = useTranslations('ProjectError');
  const v = useTranslations('ProjectIssueWidget');
  const Icon = issue.level == ProjectIssueLevel.WARNING ? TriangleAlertIcon : CircleAlertIcon;
  const [expanded, setExpanded] = useState(false);

  const issueLevels: { [key in ProjectIssueLevel]: { bg: string; bg_hover: string; fg: string; } } = {
    [ProjectIssueLevel.ERROR]: {
      bg: 'bg-destructive-soft/50 border-destructive',
      bg_hover: 'hover:bg-destructive-soft/70',
      fg: 'text-destructive'
    },
    [ProjectIssueLevel.WARNING]: {
      bg: 'bg-warning-soft/50 border-warning-soft',
      bg_hover: 'hover:bg-warning-soft/70',
      fg: 'text-warning-soft'
    },
    [ProjectIssueLevel.UNKNOWN]: {
      bg: '',
      bg_hover: '',
      fg: 'text-secondary'
    }
  };
  const activeLevel = issueLevels[issue.level];

  return (
    <div
      onClick={() => !expanded && setExpanded(true)}
      className={cn(
        'group border-secondary-dim bg-primary-dim flex w-full flex-col rounded-sm border',
        activeLevel.bg,
        !expanded && 'cursor-pointer', !expanded && activeLevel.bg_hover,
      )}
      data-state={expanded ? 'open' : 'closed'}
    >
      <div
        onClick={() => expanded && setExpanded(false)}
        className={cn(
          'flex w-full flex-row justify-between p-2',
          expanded && 'cursor-pointer', expanded && activeLevel.bg_hover,
        )}
      >
        <span className={cn(
          'flex flex-row items-center gap-2 text-sm', activeLevel.fg)}>
          <Icon className="size-4"/>
          <span className="font-medium">
            {t(issue.type)}
          </span>
        </span>

        <ChevronDown
          className={`
            text-secondary relative top-[1px] ml-1 size-4 transition-transform duration-200
            group-data-[state=open]:rotate-180
          `}
          aria-hidden="true"
        />
      </div>

      <div className="max-h-0 overflow-hidden transition-all group-data-[state=open]:max-h-96">
        <div className="flex flex-col gap-2 p-2 pt-1">
          <span className={cn('text-sm', activeLevel.fg)}>
            {u(issue.subject)}
          </span>

          <pre className="text-xsm text-secondary-alt my-2">
            {issue.details}
          </pre>

          <div className="space-y-1">
            <p className="text-secondary text-sm">
              {v.rich('file', {
                file: () => (
                  <span className="text-secondary-alt font-mono text-sm">
                    {issue.file}
                  </span>
                )
              })}
            </p>

            {issue.version_name &&
              <p className="text-secondary text-sm">
                {v.rich('version', {
                  version: () => (
                    <span className="text-xsm text-secondary-alt font-mono">
                      {issue.version_name}
                    </span>
                  )
                })}
              </p>
            }

            <p className="text-secondary text-sm">
              {v.rich('date', {
                date: () => (
                  <LocalDateTime className="text-secondary-alt text-sm"
                                 form="yyyy-MM-dd HH:mm"
                                 dateTime={new Date(issue.created_at)}
                  />
                )
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}