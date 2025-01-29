import {cn} from "@/lib/utils";

export default function DetailCategory({icon: Icon, className, innerClass, children}: {
  icon: any;
  className?: string;
  innerClass?: string;
  children?: any
}) {
  return (
    <div className={cn("flex items-center space-x-2 text-secondary", className)}>
      <Icon className="w-4 h-4"/>
      <div className={innerClass}>
        {children}
      </div>
    </div>
  );
}