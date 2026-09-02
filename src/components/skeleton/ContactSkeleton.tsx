import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactSkeleton() {
  return (
    <Container className="relative z-5 flex flex-col justify-center overflow-hidden mt-30 ltr:pl-10 rtl:pr-10 gap-10">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-5 w-2/3 max-w-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr] gap-4">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-11 w-32" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-4/5" />
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      <Skeleton className="w-full h-80 rounded-xl" />
    </Container>
  );
}
