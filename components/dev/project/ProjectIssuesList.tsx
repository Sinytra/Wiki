import ProjectIssueWidget from "@/components/dev/project/ProjectIssueWidget";
import ClientLocaleProvider from "@/components/util/ClientLocaleProvider";
import * as React from "react";
import {ProjectIssue} from "@/lib/types/serviceTypes";

export default function ProjectIssuesList({issues}: { issues: ProjectIssue[] }) {
  return (
    <ClientLocaleProvider keys={['ProjectIssueType', 'ProjectError', 'ProjectIssueWidget']}>
      {issues.map(i => (
        <ProjectIssueWidget key={i.id} issue={{...i, version_name: '1.19.2'}} />
      ))}
    </ClientLocaleProvider>
  )
}