"use client";

import { useState } from "react";

export default function GuidelinesBox() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-slate-900">
          Booking Guidelines
        </span>
        <span className="text-sm text-slate-500">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2 px-5 pb-5 text-sm text-slate-600">
            <li>• Select a date and available time range.</li>
            <li>• Existing bookings are blocked automatically.</li>
            <li>• You can cancel bookings from My Bookings.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}