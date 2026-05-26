"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

type BookingFormProps = {
  resourceId: string;
};

type ExistingBooking = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: string;
};

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export default function BookingForm({ resourceId }: BookingFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startSlot, setStartSlot] = useState("");
  const [endSlot, setEndSlot] = useState("");
  const [bookings, setBookings] = useState<ExistingBooking[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadBookings() {
    if (!selectedDate) return;

    const startOfDay = new Date(`${selectedDate}T00:00`);
    const endOfDay = new Date(`${selectedDate}T23:59`);

    const { data, error } = await supabase
      .from("bookings")
      .select("id, title, start_time, end_time, status")
      .eq("resource_id", resourceId)
      .eq("status", "confirmed")
      .gte("start_time", startOfDay.toISOString())
      .lte("start_time", endOfDay.toISOString());

    if (!error) {
      setBookings(data || []);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [selectedDate]);

  function getDateTime(slot: string) {
    return new Date(`${selectedDate}T${slot}`);
  }

  function isSlotBooked(slot: string) {
    if (!selectedDate) return false;

    const slotStart = getDateTime(slot);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    return bookings.some((booking) => {
      const existingStart = new Date(booking.start_time);
      const existingEnd = new Date(booking.end_time);

      return slotStart < existingEnd && slotEnd > existingStart;
    });
  }

  function isSlotSelected(slot: string) {
    if (!startSlot || !endSlot) return false;

    const slotTime = getDateTime(slot);
    const start = getDateTime(startSlot);
    const end = getDateTime(endSlot);

    return slotTime >= start && slotTime < end;
  }

  function handleSlotClick(slot: string) {
    if (isSlotBooked(slot)) return;

    if (!startSlot || (startSlot && endSlot)) {
      setStartSlot(slot);
      setEndSlot("");
      setMessage("");
      return;
    }

    if (getDateTime(slot) <= getDateTime(startSlot)) {
      setStartSlot(slot);
      setEndSlot("");
      setMessage("Start time updated. Now choose an end time.");
      return;
    }

    const proposedStart = getDateTime(startSlot);
    const proposedEnd = getDateTime(slot);

    const overlaps = bookings.some((booking) => {
      const existingStart = new Date(booking.start_time);
      const existingEnd = new Date(booking.end_time);

      return proposedStart < existingEnd && proposedEnd > existingStart;
    });

    if (overlaps) {
      setMessage("Selected range overlaps with an existing booking.");
      setStartSlot("");
      setEndSlot("");
      return;
    }

    setEndSlot(slot);
    setMessage("");
  }

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

    if (!title || !selectedDate || !startSlot || !endSlot) {
      setMessage("Please enter a title and select a time range.");
      setLoading(false);
      return;
    }

    const requestedStart = getDateTime(startSlot).toISOString();
    const requestedEnd = getDateTime(endSlot).toISOString();

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
      await loadBookings();
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

      <div className="mt-5 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Booking Title
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="e.g. Team meeting"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Select Date
          </label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setStartSlot("");
              setEndSlot("");
              setMessage("");
            }}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Availability Timeline
            </label>
          </div>

          <div className="mb-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-white border border-slate-300" />
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-red-100 border border-red-200" />
              Booked
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-slate-900" />
              Selected
            </span>
          </div>

          {!selectedDate ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
              Select a date to view the timeline.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {timeSlots.slice(0, -1).map((slot, index) => {
                const nextSlot = timeSlots[index + 1];
                const booked = isSlotBooked(slot);
                const selected = isSlotSelected(slot);
                const isStart = startSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={booked}
                    onClick={() => handleSlotClick(slot)}
                    className={`grid w-full grid-cols-[80px_1fr] border-b border-slate-100 text-left text-sm last:border-b-0 ${
                      booked
                        ? "cursor-not-allowed bg-red-50 text-red-400"
                        : selected || isStart
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="border-r border-slate-200 px-3 py-3 font-medium">
                      {slot}
                    </div>
                    <div className="px-4 py-3">
                      {booked
                        ? "Booked"
                        : selected || isStart
                        ? "Selected"
                        : `Available until ${nextSlot}`}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {startSlot && endSlot && (
            <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
              Selected:{" "}
              <span className="font-medium text-slate-900">
                {startSlot} - {endSlot}
              </span>
            </p>
          )}

          {startSlot && !endSlot && (
            <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              Start selected at {startSlot}. Now choose an end time.
            </p>
          )}
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