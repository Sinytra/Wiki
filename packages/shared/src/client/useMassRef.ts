import {useRef} from "react";

export interface MassRef<T> {
  get: (i: number) => T | null;
  set: (i: number) => (node: T | null) => () => void;
}

export default function useMassRef<T>(): MassRef<T> {
  const contentRefs = useRef<Record<number, T | null>>({});

  return {
    get: (i: number) => contentRefs.current[i] ?? null,
    set: (i: number) => (node: T | null) => {
      contentRefs.current[i] = node;
      return () => {
        delete contentRefs.current[i]
      };
    }
  }
}