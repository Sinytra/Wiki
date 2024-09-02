import {forwardRef} from "react"
import {Link as NextLink} from "@/lib/locales/routing";
import {createSharedPathnamesNavigation} from "next-intl/navigation";

type LinkProps = Parameters<ReturnType<typeof createSharedPathnamesNavigation>['Link']>[0];

// https://github.com/vercel/next.js/discussions/24009#discussioncomment-8267656
export const LocaleNavLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkWithRef(
    {
      // Turn next/link prefetching off by default.
      // @see https://github.com/vercel/next.js/discussions/24009
      prefetch = false,
      ...rest
    },
    ref
  ) {
    return <NextLink prefetch={prefetch} {...rest} ref={ref} />
  }
)