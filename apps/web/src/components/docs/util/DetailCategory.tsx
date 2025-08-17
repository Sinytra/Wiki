import {cn} from "@repo/ui/lib/utils";

export default function DetailCategory({icon: Icon, className, innerClass, children}: {
  icon: any;
  className?: string;
  innerClass?: string;
  children?: any
}) {
  return (
    <div className={cn("flex items-center space-x-2 text-secondary", className)}>
      <Icon className="h-4 w-4"/>
      <div className={innerClass}>
        {children}
      </div>
    </div>
  );
}