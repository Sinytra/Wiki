import {TransitionFunction, useEffect, useTransition} from "react";
import {startProgress, stopProgress} from "next-nprogress-bar";

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

function usePageDataReloadTransition() {
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    if (!loading) {
      stopProgress();
    }
  }, [loading]);

  return (callback: TransitionFunction) => {
    startProgress();
    startTransition(callback);
  };
}

export default {
  usePreventBuggyScrollLock,
  usePageDataReloadTransition
}