'use client';

import { createContext, useState } from 'react';

export interface SearchProject {
  id: string;
  name: string;
}

export interface SearchContext {
  project: SearchProject | null;
  setProject: (project: SearchProject | null) => void;
}

export const SearchContext = createContext<SearchContext | null>(null);

export default function SearchContextProvider({ children }: { children: any }) {
  const [project, setProject] = useState<SearchProject | null>(null);

  return <SearchContext.Provider value={{ project, setProject }}>{children}</SearchContext.Provider>;
}
