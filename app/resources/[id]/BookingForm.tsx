"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

type BookingFormProps = {
  resourceId: string;
};

export default function BookingForm({ resourceId }: BookingFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function createBooking() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    if (!title || !startTime || !endTime) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setMessage("End time must be later than start time.");
      setLoading(false);
      return;
    }

    const requestedStart = new Date(startTime).toISOString();
    const requestedEnd = new Date(endTime).toISOString();

    const { data: conflicts, error: conflictError } = await supabase
      .from("bookings")
      .select("id")
      .eq("resource_id", resourceId)
      .eq("status", "confirmed")
      .lt("start_time", requestedEnd)
      .gt("end_time", requestedStart);

    if (conflictError) {
      setMessage(conflictError.message);
      setLoading(false);
      return;
    }

    if (conflicts && conflicts.length > 0) {
      setMessage("This resource is already booked during the selected time.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      resource_id: resourceId,
      title,
      start_time: requestedStart,
      end_time: requestedEnd,
      status: "confirmed",
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/bookings");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Create Booking
      </h2>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Booking Title
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="e.g. Group discussion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            End Time
          </label>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {message && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {message}
          </p>
        )}

        <button
          onClick={createBooking}
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}