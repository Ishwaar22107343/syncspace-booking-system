"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

import AdminShell from "../../../components/admin/AdminShell";
import AdminProtectedPage from "../../../components/admin/AdminProtectedPage";
import AdminStats from "../../../components/admin/AdminStats";

type Profile = { id: string };
type Resource = { id: string };
type Booking = { id: string; start_time: string };

export default function AdminDashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboardData() {
    setLoading(true);

    const [profilesResult, resourcesResult, bookingsResult] =
      await Promise.all([
        supabase.from("profiles").select("id"),
        supabase.from("resources").select("id"),
        supabase.from("bookings").select("id, start_time"),
      ]);

    setProfiles((profilesResult.data || []) as Profile[]);
    setResources((resourcesResult.data || []) as Resource[]);
    setBookings((bookingsResult.data || []) as Booking[]);

    setLoading(false);
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const todayBookings = useMemo(() => {
    const now = new Date();
    const malaysiaToday = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" })
    );

    return bookings.filter((booking) => {
      const bookingDate = new Date(
        new Date(booking.start_time).toLocaleString("en-US", {
          timeZone: "Asia/Kuala_Lumpur",
        })
      );

      return (
        bookingDate.getFullYear() === malaysiaToday.getFullYear() &&
        bookingDate.getMonth() === malaysiaToday.getMonth() &&
        bookingDate.getDate() === malaysiaToday.getDate()
      );
    });
  }, [bookings]);

  return (
    <AdminProtectedPage>
      <AdminShell>
        <section className="border-b border-white/70 bg-white/50 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <p className="text-sm font-medium text-slate-500">
              Admin Dashboard
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              Monitor SyncSpace operations.
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              View platform activity, monitor usage, and manage booking
              resources across the system.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl border border-white/80 bg-white/70 shadow-sm"
                />
              ))}
            </div>
          ) : (
            <AdminStats
              totalBookings={bookings.length}
              totalResources={resources.length}
              totalUsers={profiles.length}
              todayBookings={todayBookings.length}
            />
          )}
        </section>
        
      </AdminShell>
    </AdminProtectedPage>
  );
}