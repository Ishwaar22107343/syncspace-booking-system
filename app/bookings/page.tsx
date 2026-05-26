"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedPage from "../../components/ProtectedPage";

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

  async function loadBookings() {
    setLoading(true);

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
      .order("start_time", { ascending: true });

    if (error) {
      setMessage(error.message);
    } else {
      setBookings((data || []) as unknown as Booking[]);
    }

    setLoading(false);
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

  return (
   <ProtectedPage>
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to resources
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            My Bookings
          </h1>
          <p className="mt-2 text-slate-600">
            View and manage your resource reservations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        {message && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {message}
          </p>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Create your first booking from the resources page.
            </p>
            <Link
              href="/dashboard"
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Browse Resources
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>

                    <h2 className="mt-3 text-lg font-semibold text-slate-900">
                      {booking.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      {booking.resources?.name} • {booking.resources?.location}
                    </p>

                    <p className="mt-3 text-sm text-slate-700">
                      {new Date(booking.start_time).toLocaleString()} →{" "}
                      {new Date(booking.end_time).toLocaleString()}
                    </p>
                  </div>

                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
   </ProtectedPage>
  );
}