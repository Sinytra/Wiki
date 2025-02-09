export default function PageLink({href, target, children}: {href: string; target?: string; children?: any}) {
  return (
    <a href={href} target={target} className="text-base text-blue-400 hover:underline underline-offset-4 decoration-1">
      {children}
    </a>
  )
}