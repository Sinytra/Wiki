import {TransitionFunction, useEffect, useTransition} from "react";
import {useProgress} from "@bprogress/next";

function usePreventBuggyScrollLock() {
  useEffect(() => {
    const el = document.querySelector('body')!;
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === 'data-scroll-locked') {
            (mutation.target as HTMLBodyElement).removeAttribute('data-scroll-locked')
          }
        }
      });
    });
    observer.observe(el, {attributes: true});
    return () => observer.disconnect();
  }, []);
}

function usePageDataReloadTransition(delay?: boolean) {
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

export default {
  usePreventBuggyScrollLock,
  usePageDataReloadTransition
}