import { cn } from '@repo/ui/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-primary-alt animate-pulse rounded-md', className)} {...props} />;
}

export { Skeleton };
