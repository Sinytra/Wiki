export default function DocsSubpageTitle({icon_url, subcategory, title, description}: {
  title: string;
  description: string;
  icon_url: string;
  subcategory?: string;
}) {
  return (
    <div className="flex flex-row gap-4 border-b border-secondary pb-2">
      <div className="flex justify-center items-center shrink-0">
        <img src={icon_url} alt="Icon" className="size-12 sm:size-14 rounded-sm shrink-0"/>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-primary text-lg sm:text-2xl sm:block flex flex-wrap gap-1">
          {title} {subcategory && <span className="text-secondary text-lg sm:text-xl">/ {subcategory}</span>}
        </h1>
        <blockquote className="text-secondary text-sm sm:text-base line-clamp-2">
          {description}
        </blockquote>
      </div>
    </div>
  )
}