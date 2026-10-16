import { Skeleton } from "../ui/skeleton";

export default function BlogLoadingSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <article
            key={index}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <Skeleton className="h-24 w-full shrink-0 rounded-lg sm:w-36" />

            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4 max-w-72" />

              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
