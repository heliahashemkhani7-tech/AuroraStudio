import { Skeleton } from "../ui/skeleton";

export default function ProjectsLoadingSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border"
      aria-label="Loading projects"
      aria-busy="true"
    >
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-2/5 max-w-56" />
              <Skeleton className="h-4 w-1/3 max-w-40" />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="size-9 rounded-md" />
              <Skeleton className="size-9 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}