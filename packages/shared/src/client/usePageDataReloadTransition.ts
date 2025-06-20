import {TransitionFunction, useEffect, useTransition} from "react";
import {useProgress} from "@bprogress/next";

export default function usePageDataReloadTransition(delay?: boolean) {
  const [loading, startTransition] = useTransition();
  const {start, stop} = useProgress();

  useEffect(() => {
    if (!loading) {
      stop();
    }
  }, [loading]);

  return (callback: TransitionFunction) => {
    start(0, delay ? 500 : 0);
    startTransition(callback);
  };
}
