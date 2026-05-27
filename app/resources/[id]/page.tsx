import { supabase } from "../../../lib/supabase";
import BookingForm from "./BookingForm";
import ProtectedPage from "../../../components/ProtectedPage";
import AppShell from "../../../components/AppShell";
import GuidelinesBox from "./GuidelinesBox";
import ResourceHeader from "./ResourceHeader";

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
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600 animate-content-reveal">
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
        <ResourceHeader resource={resource} />

        <section className="mx-auto max-w-5xl px-6 py-8">
          <GuidelinesBox />
          <BookingForm resourceId={resource.id} />
        </section>
      </AppShell>
    </ProtectedPage>
  );
}