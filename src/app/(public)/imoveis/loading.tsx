import { Skeleton } from "@/components/ui/skeleton";

export default function ImoveisLoading() {
  return (
    <div className="min-h-screen bg-[#F5F1E9] pb-24">
      <div className="bg-[#183B35] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Skeleton className="h-6 w-40 bg-white/15" />
          <Skeleton className="h-12 w-96 max-w-full bg-white/15" />
          <Skeleton className="h-5 w-80 max-w-full bg-white/10" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-32 w-full rounded-2xl bg-white" />
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E2DBD0] bg-white p-4 space-y-4"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-xl" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
