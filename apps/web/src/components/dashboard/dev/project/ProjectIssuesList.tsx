import ProjectIssueWidget from "@/components/dashboard/dev/project/ProjectIssueWidget";
import ClientLocaleProvider from "@repo/ui/util/ClientLocaleProvider";
import * as React from "react";

import {ProjectIssue} from "@repo/shared/types/api/project";

export default function ProjectIssuesList({issues}: { issues: ProjectIssue[] }) {
  return (
    <ClientLocaleProvider keys={['ProjectIssueType', 'ProjectError', 'ProjectIssueWidget']}>
      {issues.map(i => (
        <ProjectIssueWidget key={i.id} issue={i} />
      ))}
    </ClientLocaleProvider>
  )
}