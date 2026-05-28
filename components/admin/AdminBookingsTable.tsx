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

type AdminBookingsTableProps = {
  bookings: Booking[];
  search: string;
  setSearch: (value: string) => void;
};

export default function AdminBookingsTable({
  bookings,
  search,
  setSearch,
}: AdminBookingsTableProps) {
  function formatMalaysiaDateTime(dateString: string) {
    return new Intl.DateTimeFormat("en-MY", {
      timeZone: "Asia/Kuala_Lumpur",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  }

  return (
    <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Booking Overview
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Search bookings by user, resource, location, title, or status.
          </p>
        </div>

        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 md:max-w-sm"
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase tracking-wide text-white">
            <tr>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No matching bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">
                      {booking.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {booking.resources?.type || "Resource"}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">
                      {booking.profiles?.full_name || "Unknown"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {booking.profiles?.email || "No email"}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">
                      {booking.resources?.name || "Unknown"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {booking.resources?.location || "No location"}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-slate-900">
                      {formatMalaysiaDateTime(booking.start_time)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      until {formatMalaysiaDateTime(booking.end_time)}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}