import { Skeleton } from "../ui/skeleton";

export default function DashboardLoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-background/50 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-5 rounded-md" />
          </div>

          <Skeleton className="mt-4 h-9 w-20" />
        </div>
      ))}
    </div>
  );
}
