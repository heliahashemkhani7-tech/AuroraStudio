import Container from "../layout/Container";
import { Skeleton } from "../ui/skeleton";

export default function BlogDetailsSkeleton() {
  return (
    <Container className="z-4 mt-25 text-text">
      <div className="space-y-8">
        {/* Cover */}
        <Skeleton className="aspect-video w-full rounded-3xl md:aspect-[16/7]" />

        {/* Author and date */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-1 w-1 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <Skeleton className="h-9 w-full md:h-12" />
          <Skeleton className="h-9 w-4/5 md:h-12" />
        </div>

        {/* Excerpt */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Article content */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-7 w-2/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-4/5" />

          <Skeleton className="mt-6 h-7 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </Container>
  );
}
