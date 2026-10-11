
import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogSkeleton() {
  return (
    <Container className="relative z-4 text-text mt-30">
      {/* Blog Header */}
      <section className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64 max-w-full md:h-14 md:w-96" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <Skeleton className="h-5 w-2/3 max-w-xl" />
      </section>

      {/* Blog Cards */}
      <section className="mt-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              {/* Cover Image */}
              <Skeleton className="aspect-[16/10] w-full rounded-xl" />

              {/* Date / Category */}
              <Skeleton className="h-4 w-32" />

              {/* Title */}
              <Skeleton className="h-6 w-4/5" />

              {/* Excerpt */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
