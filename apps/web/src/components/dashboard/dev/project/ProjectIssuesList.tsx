import ProjectIssueWidget from '@/components/dashboard/dev/project/ProjectIssueWidget';
import ClientLocaleProvider from '@repo/ui/util/ClientLocaleProvider';
import * as React from 'react';

import {ProjectIssueInfo} from '@sinytra/wiki-api-types';

export default function ProjectIssuesList({issues}: { issues: ProjectIssueInfo[] }) {
  return (
    <ClientLocaleProvider keys={['ProjectIssueType', 'ProjectError', 'ProjectIssueWidget']}>
      {issues.map(i => (
        <ProjectIssueWidget key={i.id} issue={i}/>
      ))}
    </ClientLocaleProvider>
  );
}