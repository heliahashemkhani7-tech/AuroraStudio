import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailsSkeleton() {
  return (
    <Container className="z-4 mt-30 flex flex-col gap-8 md:gap-20 overflow-hidden">
      <section className="w-full flex flex-col gap-6">
        <Skeleton className="w-full h-80 md:h-120 rounded-xl" />
      </section>

      <section className="w-full flex flex-col gap-5">
        <Skeleton className="h-8 w-48" />

        <div className="flex flex-col gap-3 max-w-3xl">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-2/3" />
        </div>

        <Skeleton className="h-10 w-32" />
      </section>

      <section className="w-full flex flex-col gap-5">
        <Skeleton className="h-8 w-48" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Skeleton className="w-full h-60 rounded-xl" />
          <Skeleton className="w-full h-60 rounded-xl" />
        </div>
      </section>
    </Container>
  );
}
