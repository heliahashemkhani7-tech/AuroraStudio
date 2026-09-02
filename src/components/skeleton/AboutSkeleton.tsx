import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Container from "@/components/layout/Container";

export default function AboutSkeleton() {
  return (
    <main className="relative overflow-hidden text-text h-screen mt-30 md:mt-10">
      <Container className="relative z-10 w-full flex flex-col items-center h-full  justify-center gap-5 py-8">

        <section className="w-full space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="h-5 w-4/5 max-w-2xl" />
        </section>

        <Separator className="w-full h-0.5 bg-separator" />

        <section className="w-full space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </section>

        <Separator className="w-full h-0.5 bg-separator" />

        <section className="w-full space-y-4">
          <Skeleton className="h-8 w-56" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </section>

      </Container>
    </main>
  );
}