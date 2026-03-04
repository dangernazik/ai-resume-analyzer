import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsSkeleton() {
  return (
    <div className="space-y-6">

      {/* Скор */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center space-y-3">
        <Skeleton className="h-3 w-24 mx-auto bg-slate-700" />
        <Skeleton className="h-24 w-32 mx-auto bg-slate-700" />
        <Skeleton className="h-3 w-12 mx-auto bg-slate-700" />
      </div>

      {/* Сильні сторони */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
        <Skeleton className="h-4 w-36 bg-slate-700" />
        <Skeleton className="h-12 w-full bg-slate-700" />
        <Skeleton className="h-12 w-full bg-slate-700" />
        <Skeleton className="h-12 w-4/5 bg-slate-700" />
      </div>

      {/* Слабкі сторони */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
        <Skeleton className="h-4 w-36 bg-slate-700" />
        <Skeleton className="h-12 w-full bg-slate-700" />
        <Skeleton className="h-12 w-full bg-slate-700" />
        <Skeleton className="h-12 w-3/4 bg-slate-700" />
      </div>

      {/* Поради */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
        <Skeleton className="h-4 w-24 bg-slate-700" />
        <Skeleton className="h-12 w-full bg-slate-700" />
        <Skeleton className="h-12 w-full bg-slate-700" />
        <Skeleton className="h-12 w-4/5 bg-slate-700" />
      </div>

    </div>
  );
}