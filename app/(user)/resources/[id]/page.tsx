import { supabase } from "../../../../lib/supabase";
import BookingForm from "../../../../components/user/BookingForm";
import ProtectedPage from "../../../../components/user/ProtectedPage";
import AppShell from "../../../../components/user/AppShell";
import GuidelinesBox from "../../../../components/user/GuidelinesBox";
import ResourceHeader from "../../../../components/user/ResourceHeader";

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
          <section className="mx-auto w-full max-w-[1600px] px-6 py-8 2xl:px-10">
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

        <section className="mx-auto w-full max-w-[1600px] px-6 py-8 2xl:px-10">
          <GuidelinesBox />
          <BookingForm 
          resourceId={resource.id} 
          resourceName={resource.name}
          resourceLocation={resource.location}
          />
        </section>
      </AppShell>
    </ProtectedPage>
  );
}