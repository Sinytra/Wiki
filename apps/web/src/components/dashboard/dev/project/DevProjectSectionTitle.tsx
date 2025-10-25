import {cn} from "@repo/ui/lib/utils";

export default function DevProjectSectionTitle({title, desc, icon: Icon, ping, className}: {
  title: string;
  desc?: string;
  icon?: any;
  ping?: any;
  className?: string;
}) {
  return (
    <div className="w-fit space-y-1">
      <h3 className={cn('flex flex-row items-center gap-2 text-lg font-medium', className)}>
        {Icon && <Icon className="size-5"/>}
        {title}
        {ping}
      </h3>
      <p className="text-sm text-secondary">
        {desc}
      </p>
    </div>
  );
}