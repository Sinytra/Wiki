export default function DocsSubpageTitle({icon_url, subcategory, title, description}: {
  title: string;
  description: string;
  icon_url: string;
  subcategory?: string;
}) {
  return (
    <div className="flex flex-row gap-4 border-b border-secondary pb-2">
      <div className="flex shrink-0 items-center justify-center">
        <img src={icon_url} alt="Icon" className="size-12 shrink-0 rounded-sm sm:size-14"/>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="flex flex-wrap gap-1 text-lg text-primary sm:block sm:text-2xl">
          {title} {subcategory && <span className="text-lg text-secondary sm:text-xl">/ {subcategory}</span>}
        </h1>
        <blockquote className="line-clamp-2 text-sm text-secondary sm:text-base">
          {description}
        </blockquote>
      </div>
    </div>
  )
}