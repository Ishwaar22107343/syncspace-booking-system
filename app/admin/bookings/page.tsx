"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

import AdminShell from "../../../components/admin/AdminShell";
import AdminProtectedPage from "../../../components/admin/AdminProtectedPage";
import AdminBookingsTable from "../../../components/admin/AdminBookingsTable";

type Booking = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
  resources: {
    name: string;
    location: string;
    type: string;
  } | null;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadBookings() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        title,
        start_time,
        end_time,
        status,
        profiles (
          full_name,
          email
        ),
        resources (
          name,
          location,
          type
        )
      `)
      .order("start_time", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setBookings((data || []) as unknown as Booking[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return bookings;

    return bookings.filter((booking) => {
      return (
        booking.title.toLowerCase().includes(keyword) ||
        booking.status.toLowerCase().includes(keyword) ||
        booking.profiles?.full_name?.toLowerCase().includes(keyword) ||
        booking.profiles?.email?.toLowerCase().includes(keyword) ||
        booking.resources?.name?.toLowerCase().includes(keyword) ||
        booking.resources?.location?.toLowerCase().includes(keyword) ||
        booking.resources?.type?.toLowerCase().includes(keyword)
      );
    });
  }, [bookings, search]);

  return (
    <AdminProtectedPage>
      <AdminShell>
        <section className="border-b border-white/70 bg-white/50 backdrop-blur">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-8 2xl:px-10">
            <p className="text-sm font-medium text-slate-500">
              Booking Overview
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              Monitor all reservations.
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Search, review, and track booking activity across all users and
              resources.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1600px] px-6 py-8 2xl:px-10">
          {message && (
            <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          {loading ? (
            <div className="space-y-4 rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur">
              <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200/70" />
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-slate-200/70"
                />
              ))}
            </div>
          ) : (
            <AdminBookingsTable
              bookings={filteredBookings}
              search={search}
              setSearch={setSearch}
            />
          )}
        </section>
      </AdminShell>
    </AdminProtectedPage>
  );
}