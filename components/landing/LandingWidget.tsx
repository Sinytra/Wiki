import {LocaleNavLink} from "@/components/navigation/link/LocaleNavLink";

export default function LandingWidget({ title, href, link: Link = LocaleNavLink, children }: { title: string, href: string, link?: any, children: any }) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-neutral-800 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/30"
      rel="noopener noreferrer"
    >
      <h2 className="mb-3 text-2xl font-semibold">
        {title}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
        {children}
      </p>
    </Link>
  )
}