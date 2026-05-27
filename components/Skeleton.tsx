// components/Skeleton.tsx

export function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]">
      {/* Nav skeleton */}
      <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
            <div className="space-y-1">
              <div className="h-3.5 w-20 animate-pulse rounded-md bg-slate-200" />
              <div className="h-3 w-28 animate-pulse rounded-md bg-slate-200/70" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-200/70" />
            <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200/70" />
            <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </nav>

      {/* Header skeleton */}
      <section className="border-b border-white/70 bg-white/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-8 space-y-3">
          <div className="h-4 w-40 animate-pulse rounded-md bg-slate-200/70" />
          <div className="h-10 w-3/4 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-200/70" />
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-2xl border border-white/80 p-5 shadow-sm backdrop-blur space-y-3 ${
                i === 3 ? "bg-slate-950" : "bg-white/80"
              }`}
            >
              <div className={`h-3.5 w-32 animate-pulse rounded-md ${i === 3 ? "bg-slate-700" : "bg-slate-200"}`} />
              <div className={`h-8 w-16 animate-pulse rounded-lg ${i === 3 ? "bg-slate-700" : "bg-slate-200"}`} />
              <div className={`h-3 w-44 animate-pulse rounded-md ${i === 3 ? "bg-slate-800" : "bg-slate-200/70"}`} />
            </div>
          ))}
        </div>

        {/* Resource cards skeleton */}
        <div className="h-7 w-48 animate-pulse rounded-lg bg-slate-200 mb-2" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-slate-200/70 mb-6" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded-md bg-slate-200/70" />
                  <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-200" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200/70" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-full animate-pulse rounded-md bg-slate-200/70" />
                <div className="h-3.5 w-4/5 animate-pulse rounded-md bg-slate-200/70" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-2/3 animate-pulse rounded-md bg-slate-200/70" />
                <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-slate-200/70" />
              </div>
              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function BookingsSkeleton() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]">
      <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
            <div className="space-y-1">
              <div className="h-3.5 w-20 animate-pulse rounded-md bg-slate-200" />
              <div className="h-3 w-28 animate-pulse rounded-md bg-slate-200/70" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-200/70" />
            <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200/70" />
            <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </nav>

      <section className="border-b border-white/70 bg-white/50 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-8 space-y-3">
          <div className="h-9 w-44 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-80 animate-pulse rounded-md bg-slate-200/70" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200/70" />
                <div className="h-6 w-48 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-4 w-64 animate-pulse rounded-md bg-slate-200/70" />
                <div className="h-4 w-72 animate-pulse rounded-md bg-slate-200/70" />
              </div>
              <div className="h-9 w-36 animate-pulse rounded-xl bg-slate-200/70" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export function ResourcePageSkeleton() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]">
      <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
            <div className="space-y-1">
              <div className="h-3.5 w-20 animate-pulse rounded-md bg-slate-200" />
              <div className="h-3 w-28 animate-pulse rounded-md bg-slate-200/70" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-200/70" />
            <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-200/70" />
            <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </nav>

      <section className="border-b border-white/70 bg-white/50 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-8 space-y-3">
          <div className="h-3.5 w-20 animate-pulse rounded-md bg-slate-200/70" />
          <div className="h-9 w-64 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-slate-200/70" />
          <div className="h-4 w-3/4 max-w-xl animate-pulse rounded-md bg-slate-200/70" />
          <div className="flex gap-3 mt-4">
            <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200/70" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-slate-200/70" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-white/80 mb-6" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-start pb-5 border-b border-slate-200 mb-5">
            <div className="space-y-2">
              <div className="h-6 w-36 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-4 w-64 animate-pulse rounded-md bg-slate-200/70" />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-[0.8fr_1.4fr]">
            <div className="space-y-4">
              <div className="h-24 animate-pulse rounded-xl bg-slate-200/50" />
              <div className="h-24 animate-pulse rounded-xl bg-slate-200/50" />
              <div className="h-20 animate-pulse rounded-xl bg-slate-200/50" />
              <div className="h-11 animate-pulse rounded-lg bg-slate-200" />
            </div>
            <div className="h-[480px] animate-pulse rounded-xl bg-slate-200/50" />
          </div>
        </div>
      </section>
    </main>
  );
}