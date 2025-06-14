'use client'

import {useTranslations} from "next-intl";
import {ChevronDown, CircleAlertIcon, TriangleAlertIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import * as React from "react";
import {useState} from "react";
import {ProjectIssue, ProjectIssueLevel} from "@/lib/types/serviceTypes";

export default function ProjectIssueWidget({issue}: { issue: ProjectIssue }) {
  const u = useTranslations('ProjectIssueType');
  const Icon = issue.level == ProjectIssueLevel.WARNING ? TriangleAlertIcon : CircleAlertIcon;
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={cn(
        'flex w-full flex-col rounded-sm border border-secondary-dim bg-primary-dim p-2',
        issue.level == ProjectIssueLevel.WARNING && 'bg-warning-soft/50 border-warning-soft hover:bg-warning-soft/70',
        issue.level == ProjectIssueLevel.ERROR && 'bg-destructive-soft/50 border-destructive hover:bg-destructive-soft/70',
        'group cursor-pointer'
      )}
      data-state={expanded ? 'open' : 'closed'}
    >
      <div className="flex w-full flex-row justify-between">
        <span className={cn(
          'flex flex-row items-center gap-2 text-sm',
          issue.level == ProjectIssueLevel.WARNING && 'text-warning-soft',
          issue.level == ProjectIssueLevel.ERROR && 'text-destructive'
        )}>
          <Icon className="size-4"/>
          {/*TODO TRANSLATE*/}
          <span className="font-medium">{u(issue.type)}</span>
        </span>

        <ChevronDown
          className={`
            relative top-[1px] ml-1 size-4 text-secondary transition-transform duration-200
            group-data-[state=open]:rotate-180
          `}
          aria-hidden="true"
        />
      </div>

      <div className="max-h-0 overflow-hidden transition-all group-data-[state=open]:max-h-96">
        <div className="mt-2 flex flex-col gap-1">
          <span className={cn(
            'text-sm',
            issue.level == ProjectIssueLevel.WARNING && 'text-warning-soft',
            issue.level == ProjectIssueLevel.ERROR && 'text-destructive'
          )}>
            {/*TODO TRANSLATE*/}
            {issue.subject}
          </span>

          {/*TODO TRANSLATE*/}
          <pre className="text-xs text-secondary">
            {issue.details}
          </pre>

          <span className="text-sm text-secondary">
            {/*TODO*/}
            Path: {issue.file}
          </span>
        </div>
      </div>
    </div>
  )
}