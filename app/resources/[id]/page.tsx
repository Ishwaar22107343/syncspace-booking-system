import { supabase } from "../../../lib/supabase";
import BookingForm from "./BookingForm";
import ProtectedPage from "../../../components/ProtectedPage";
import AppShell from "../../../components/AppShell";
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
      <ProtectedPage>
        <AppShell>
          <section className="mx-auto max-w-5xl px-6 py-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
              Resource not found.
            </div>
          </section>
        </AppShell>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <AppShell>
        <section className="border-b border-white/70 bg-white/50 backdrop-blur">
          <div className="mx-auto max-w-5xl px-6 py-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {resource.type}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              {resource.name}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              {resource.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-white bg-white/80 px-3 py-1 shadow-sm">
                {resource.location}
              </span>

              {resource.capacity && (
                <span className="rounded-full border border-white bg-white/80 px-3 py-1 shadow-sm">
                  {resource.capacity} pax
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-8">
          <GuidelinesBox />

          <BookingForm resourceId={resource.id} />
        </section>
      </AppShell>
    </ProtectedPage>
  );
}