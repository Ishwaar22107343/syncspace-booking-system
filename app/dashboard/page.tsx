"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import ProtectedPage from "../../components/ProtectedPage";

type Resource = {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number | null;
  description: string | null;
  is_available: boolean;
};

type Booking = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  resources: {
    name: string;
    location: string;
  } | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const showIntro = searchParams.get("intro") === "true";

  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [introVisible, setIntroVisible] = useState(showIntro);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!introVisible) return;

    const timer = setTimeout(() => {
      setIntroVisible(false);
      router.replace("/dashboard");
    }, 1600);

    return () => clearTimeout(timer);
  }, [introVisible, router]);

  async function loadDashboard() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const now = new Date().toISOString();

    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profileData?.full_name) {
      setUserName(profileData.full_name);
    }

    const { data: resourcesData, error: resourcesError } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: true });

    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        id,
        title,
        start_time,
        end_time,
        resources (
          name,
          location
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .gte("start_time", now)
      .order("start_time", { ascending: true });

    if (resourcesError || bookingsError) {
      setMessage(
        resourcesError?.message ||
          bookingsError?.message ||
          "Failed to load dashboard."
      );
    } else {
      setResources(resourcesData || []);
      setBookings((bookingsData || []) as unknown as Booking[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  function formatMalaysiaDateTime(dateString: string) {
    return new Intl.DateTimeFormat("en-MY", {
      timeZone: "Asia/Kuala_Lumpur",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  }

  const activeBookings = bookings.length;
  const totalResources = resources.length;
  const nextBooking = bookings[0];
  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ProtectedPage>
      {introVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
          <div className="relative flex flex-col items-center">
            <div className="h-24 w-24 animate-[spin_2s_linear_infinite] rounded-3xl bg-gradient-to-br from-sky-300 via-indigo-400 to-pink-300 shadow-2xl shadow-indigo-500/40" />
            <h2 className="mt-6 text-2xl font-bold text-white">
              Entering SyncSpace
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Preparing your workspace...
            </p>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]">
        <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-sm">
                S
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">SyncSpace</p>
                <p className="text-xs text-slate-500">Resource booking</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/bookings"
                className="hidden rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex"
              >
                My Bookings
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
                    {initials}
                  </div>
                  <div className="hidden text-left md:block">
                    <p className="max-w-[140px] truncate text-sm font-medium text-slate-900">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-500">Account</p>
                  </div>
                  <span className="text-xs text-slate-400">▾</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {userName}
                      </p>
                      <p className="text-xs text-slate-500">
                        Signed in to SyncSpace
                      </p>
                    </div>

                    <Link
                      href="/bookings"
                      className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 sm:hidden"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Bookings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <section className="border-b border-white/70 bg-white/50 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Welcome back, {userName}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                Book shared spaces without the back-and-forth.
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Manage rooms, studios, equipment, and shared facilities from one
                clean dashboard.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-8">
          {message && (
            <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          {loading ? (
            <div className="rounded-2xl border border-white/80 bg-white/80 p-8 text-sm text-slate-600 shadow-sm">
              Loading your dashboard...
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <p className="text-sm font-medium text-slate-500">
                    My Upcoming Bookings
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {activeBookings}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Future confirmed reservations
                  </p>
                </div>

                <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <p className="text-sm font-medium text-slate-500">
                    Resources
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {totalResources}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Rooms, equipment, and shared facilities
                  </p>
                </div>

                <div className="rounded-2xl border border-white/80 bg-slate-950 p-5 text-white shadow-sm">
                  <p className="text-sm font-medium text-slate-300">
                    Next Booking
                  </p>

                  {nextBooking ? (
                    <>
                      <p className="mt-3 text-lg font-semibold">
                        {nextBooking.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {nextBooking.resources?.name}
                      </p>
                      <p className="mt-3 text-sm text-slate-300">
                        {formatMalaysiaDateTime(nextBooking.start_time)}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-slate-300">
                      No upcoming bookings yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Available Resources
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Choose a resource to view its schedule and create a booking.
                  </p>
                </div>

                <div className="rounded-full border border-white bg-white/80 px-4 py-2 text-sm text-slate-500 shadow-sm">
                  {totalResources} resources listed
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="group rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {resource.type}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950">
                          {resource.name}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          resource.is_available
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {resource.is_available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <p className="min-h-[48px] text-sm leading-6 text-slate-600">
                      {resource.description}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-medium text-slate-900">
                          Location:
                        </span>{" "}
                        {resource.location}
                      </p>

                      {resource.capacity && (
                        <p>
                          <span className="font-medium text-slate-900">
                            Capacity:
                          </span>{" "}
                          {resource.capacity} pax
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/resources/${resource.id}`}
                      className="mt-5 inline-flex w-full justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition group-hover:bg-slate-800"
                    >
                      View Schedule
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </ProtectedPage>
  );
}