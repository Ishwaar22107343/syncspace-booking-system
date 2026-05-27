export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 animate-[spin_1.6s_linear_infinite] rounded-2xl bg-gradient-to-br from-sky-300 via-indigo-400 to-pink-300 shadow-xl shadow-indigo-500/30" />
        <p className="mt-5 text-sm font-medium text-slate-600">
          Loading SyncSpace...
        </p>
      </div>
    </main>
  );
}