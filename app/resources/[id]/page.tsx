import { supabase } from "../../../lib/supabase";
import BookingForm from "./BookingForm";
import Link from "next/link";
import ProtectedPage from "../../../components/ProtectedPage";

type ResourcePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { id } = await params;
  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !resource) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <p className="text-red-600">Resource not found.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-slate-700 underline">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
   <ProtectedPage>
    <main className="min-h-screen bg-slate-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to resources
          </Link>

          <p className="mt-6 text-xs font-medium uppercase tracking-wide text-slate-500">
            {resource.type}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {resource.name}
          </h1>

          <p className="mt-3 text-slate-600">
            {resource.description}
          </p>

          <div className="mt-4 flex gap-4 text-sm text-slate-600">
            <span>{resource.location}</span>
            {resource.capacity && <span>{resource.capacity} pax</span>}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-6 py-8 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Booking Guidelines
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Choose a clear title for your booking.</li>
            <li>• End time must be later than start time.</li>
            <li>• Double bookings will be blocked in the next layer.</li>
            <li>• You can manage your bookings from My Bookings.</li>
          </ul>
        </div>

        <BookingForm resourceId={resource.id} />
      </section>
    </main>
   </ProtectedPage>
  );
}