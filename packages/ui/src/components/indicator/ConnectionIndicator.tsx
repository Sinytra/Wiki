import { cn } from '@repo/ui/lib/utils';

export default function ConnectionIndicator({ className }: { className?: string }) {
  return (
    <div className={cn('bg-success-soft text-success inline-flex items-center rounded-full p-1', className)}>
      <div className="bg-success h-2 w-2 rounded-full"></div>
    </div>
  );
}
