import { supabase } from "../../../lib/supabase";
import BookingForm from "./BookingForm";
import Link from "next/link";
import ProtectedPage from "../../../components/ProtectedPage";
import GuidelinesBox from "./GuidelinesBox";

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

      <section className="mx-auto max-w-5xl px-6 py-8">
        <GuidelinesBox />

        <BookingForm resourceId={resource.id} />
      </section>
    </main>
   </ProtectedPage>
  );
}