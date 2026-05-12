export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="aspect-[2/3] w-full animate-pulse bg-slate-200 dark:bg-slate-800"></div>
      <div className="space-y-3 p-4">
        <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="flex gap-2">
          <div className="h-5 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-5 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  )
}

export function MovieGridSkeleton({ count = 8 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function DetailPageSkeleton() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="aspect-[2/3] w-full animate-pulse bg-slate-200 dark:bg-slate-800 lg:aspect-auto"></div>
        <div className="space-y-6 p-8 lg:p-12">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-12 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="h-28 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    </section>
  )
}