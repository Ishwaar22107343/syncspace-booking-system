"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import ProtectedPage from "../../components/ProtectedPage";
import AppShell from "../../components/AppShell";

type Booking = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  resources: {
    name: string;
    type: string;
    location: string;
  } | null;
};

export default function BookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [revealed, setRevealed] = useState(false);

  async function loadBookings() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        title,
        start_time,
        end_time,
        status,
        resources (
          name,
          type,
          location
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .gt("end_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    if (error) {
      setMessage(error.message);
    } else {
      setBookings((data || []) as unknown as Booking[]);
    }

    setLoading(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
  }

  async function cancelBooking(bookingId: string) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      setMessage(error.message);
      return;
    }

    loadBookings();
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function formatMalaysiaDateTime(dateString: string) {
    return new Intl.DateTimeFormat("en-MY", {
      timeZone: "Asia/Kuala_Lumpur",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  }

  return (
    <ProtectedPage>
      <AppShell>
        <section className="border-b border-white/70 bg-white/50 backdrop-blur">
          <div className="mx-auto max-w-5xl px-6 py-8">
            <h1
              className="text-3xl font-bold text-slate-950"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 300ms ease, transform 300ms ease",
              }}
            >
              My Bookings
            </h1>
            <p
              className="mt-2 text-slate-600"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 300ms ease 60ms, transform 300ms ease 60ms",
              }}
            >
              View and manage your confirmed resource reservations.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-8">
          {message && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-content-reveal">
              {message}
            </p>
          )}

          {!loading && bookings.length === 0 && (
            <div
              className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 350ms ease 120ms, transform 350ms ease 120ms",
              }}
            >
              <h2 className="text-lg font-semibold text-slate-900">
                No bookings yet
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Create your first booking from the dashboard.
              </p>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking, i) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur transition hover:shadow-md"
                  style={{
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 380ms ease ${100 + i * 70}ms, transform 380ms ease ${100 + i * 70}ms`,
                  }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        {booking.status}
                      </span>

                      <h2 className="mt-3 text-lg font-semibold text-slate-950">
                        {booking.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {booking.resources?.name} •{" "}
                        {booking.resources?.location}
                      </p>

                      <p className="mt-3 text-sm text-slate-700">
                        {formatMalaysiaDateTime(booking.start_time)} →{" "}
                        {formatMalaysiaDateTime(booking.end_time)}
                      </p>
                    </div>

                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </AppShell>
    </ProtectedPage>
  );
}