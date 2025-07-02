import {ComponentPropsWithoutRef, forwardRef} from "react"
import {Link, Link as NextLink} from "@/lib/locales/routing";

// https://github.com/vercel/next.js/discussions/24009#discussioncomment-8267656
export const LocaleNavLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof Link>
>(
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