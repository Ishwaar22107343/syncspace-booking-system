import { supabase } from "../../lib/supabase";
import Link from "next/link";

type Resource = {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number | null;
  description: string | null;
  is_available: boolean;
};

export default async function DashboardPage() {
  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <p className="text-red-600">Failed to load resources.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900">SyncSpace</h1>
          <p className="mt-2 text-slate-600">
            Browse and book shared rooms, equipment, and workspaces.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Available Resources
            </h2>
            <p className="text-sm text-slate-500">
              Select a resource to create a booking.
            </p>
          </div>

          <Link
            href="/bookings"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            My Bookings
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources?.map((resource: Resource) => (
            <div
              key={resource.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {resource.type}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {resource.name}
                  </h3>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    resource.is_available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {resource.is_available ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="text-sm text-slate-600">
                {resource.description}
              </p>

              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">Location:</span>{" "}
                  {resource.location}
                </p>

                {resource.capacity && (
                  <p>
                    <span className="font-medium text-slate-800">Capacity:</span>{" "}
                    {resource.capacity} pax
                  </p>
                )}
              </div>

              <Link
                href={`/resources/${resource.id}`}
                className="mt-5 inline-flex w-full justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                View & Book
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}