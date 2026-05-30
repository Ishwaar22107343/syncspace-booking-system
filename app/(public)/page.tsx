import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_28%),linear-gradient(to_bottom,#f8fafc,#eef2f7)] text-slate-950">
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-sm">
            S
          </div>
          <div>
            <p className="text-sm font-bold">SyncSpace</p>
            <p className="text-xs text-slate-500">Resource booking</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white/60"
          >
            Login
          </Link>
          <Link
            href="/auth?mode=signup"
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 md:grid-cols-[1fr_0.9fr] md:py-20">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            Smart booking for shared spaces
          </div>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
            Book shared spaces without the back-and-forth.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            SyncSpace helps users reserve rooms, labs, equipment, and shared
            facilities with real-time availability, conflict prevention,
            confirmation emails, and automated reminders.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#features"
              className="rounded-2xl border border-white/60 bg-white/40 px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/60"
            >
              View Features
            </a>
          </div>
        </div>

        <div className="relative h-[430px]">
          <div className="absolute inset-0 rounded-[2rem] border border-white/80 bg-white/50 shadow-2xl shadow-slate-900/10 backdrop-blur" />

          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-gradient-to-br from-sky-300 via-indigo-400 to-pink-300 shadow-2xl shadow-indigo-500/30 animate-[spin_12s_linear_infinite]" />

          <div className="absolute left-10 top-14 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-xl backdrop-blur animate-[float_4s_ease-in-out_infinite]">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Discussion Room
            </p>
            <p className="mt-1 text-lg font-bold text-slate-950">
              10:00 AM
            </p>
            <p className="mt-1 text-sm text-emerald-600">Available</p>
          </div>

          <div className="absolute right-8 top-28 rounded-2xl border border-white/80 bg-slate-950 p-4 text-white shadow-xl animate-[float_5s_ease-in-out_infinite]">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Reminder
            </p>
            <p className="mt-1 text-lg font-bold">Daily 8am</p>
            <p className="mt-1 text-sm text-slate-300">Email sent</p>
          </div>

          <div className="absolute bottom-16 left-16 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-xl backdrop-blur animate-[float_4.5s_ease-in-out_infinite]">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Conflict Check
            </p>
            <p className="mt-1 text-lg font-bold text-slate-950">
              No overlaps
            </p>
            <p className="mt-1 text-sm text-slate-500">Booking confirmed</p>
          </div>

          <div className="absolute bottom-8 right-14 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-xl backdrop-blur animate-[float_5.5s_ease-in-out_infinite]">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Dashboard
            </p>
            <p className="mt-1 text-lg font-bold text-slate-950">
              3 upcoming
            </p>
            <p className="mt-1 text-sm text-slate-500">Personalized view</p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-4">
          {[
            {
              title: "Smart Scheduling",
              desc: "Select available time slots with a clean scheduler-style booking flow.",
            },
            {
              title: "Conflict Prevention",
              desc: "Stops overlapping bookings before they happen.",
            },
            {
              title: "Email Confirmation",
              desc: "Sends instant confirmation after each successful booking.",
            },
            {
              title: "Auto Reminders",
              desc: "Scheduled reminders notify users before their booking starts.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-lg font-bold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[2rem] border border-white/80 bg-slate-950 p-8 text-center text-white shadow-2xl shadow-slate-900/15">
          <h2 className="text-3xl font-bold">
            Ready to simplify resource booking?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Start managing shared spaces with a smoother, smarter booking
            experience.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth?mode=signup"
              className="inline-flex rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Create Free Account
            </Link>
            <Link
              href="/auth"
              className="inline-flex rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}