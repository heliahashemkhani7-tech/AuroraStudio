import Container from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  cards?: number;
};

export default function PortfolioSkeleton({ cards = 6 }: Props) {
  return (
    <Container className="flex items-center">
      <div className="z-10 text-text flex flex-col w-screen overflow-hidden mt-50 gap-5">
        <div className="w-full px-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        </div>

        <div className="flex gap-3 px-4 mt-8 w-full justify-center">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-y-7 p-4 gap-x-0 mt-8 w-full mx-auto justify-items-center">
          {Array.from({ length: cards }).map((_, index) => (
            <div key={index} className="w-full max-w-sm">
              <Skeleton className="aspect-video w-full rounded-xl" />
            </div>
          ))}
        </section>
      </div>
    </Container>
  );
}
