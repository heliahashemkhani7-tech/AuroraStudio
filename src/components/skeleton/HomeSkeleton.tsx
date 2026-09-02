import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <main className="h-screen bg-hero-background p-0 w-full">
      <Container className="flex flex-col justify-center gap-8  h-full">
        <Skeleton className="h-20 w-3/4 max-w-3xl" />

        <div className="w-full max-w-xl flex flex-col  gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="flex gap-4 mt-4">
          <Skeleton className="h-11 w-32 rounded-lg" />
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
      </Container>
    </main>
  );
}
