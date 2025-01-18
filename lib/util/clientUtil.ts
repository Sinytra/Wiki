import {TransitionFunction, useEffect, useRef, useTransition} from "react";
import {toast} from "sonner";
import {useTranslations} from "next-intl";

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
  const t = useTranslations('DevPageRefreshTransition');
  const [loading, startTransition] = useTransition();
  const transitionResolveRef = useRef<((v: any) => void) | undefined>(undefined);

  useEffect(() => {
    if (!loading && transitionResolveRef.current) {
      transitionResolveRef.current(null);
      transitionResolveRef.current = undefined;
    }
  }, [loading]);

  return (callback: TransitionFunction) => {
    toast.promise(new Promise(resolve => {
      transitionResolveRef.current = resolve;
    }), {
      loading: t('loading'),
      success: t('success'),
      error: t('error')
    });
    startTransition(callback);
  };
}

export default {
  usePreventBuggyScrollLock,
  usePageDataReloadTransition
}