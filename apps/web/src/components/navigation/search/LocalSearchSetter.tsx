'use client';

import { ReactNode, useContext, useEffect } from 'react';
import { SearchContext, SearchProject } from '@/components/navigation/search/SearchContext';

export default function LocalSearchSetter({ project, children }: { project: SearchProject; children: ReactNode }) {
  const { setProject } = useContext(SearchContext)!;

  useEffect(() => {
    setProject(project);

    return () => setProject(null);
  }, []);

  return children;
}
