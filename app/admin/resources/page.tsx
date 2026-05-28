"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

import AdminShell from "../../../components/admin/AdminShell";
import AdminProtectedPage from "../../../components/admin/AdminProtectedPage";
import AdminResourceForm from "../../../components/admin/AdminResourceForm";

type Resource = {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number | null;
  description: string | null;
  is_available: boolean;
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showAddResource, setShowAddResource] = useState(false);

  async function loadResources() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("resources")
      .select("id, name, type, location, capacity, description, is_available")
      .order("created_at", { ascending: true });

    if (error) {
      setMessage(error.message);
    } else {
      setResources((data || []) as Resource[]);
    }

    setLoading(false);
  }

  async function handleAddResource(resource: {
    name: string;
    type: string;
    location: string;
    capacity: number | null;
    description: string;
  }) {
    setMessage("");

    const { error } = await supabase.from("resources").insert({
      name: resource.name,
      type: resource.type,
      location: resource.location,
      capacity: resource.capacity,
      description: resource.description,
      is_available: true,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setShowAddResource(false);
    await loadResources();
  }

  async function handleDeleteResource(resourceId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", resourceId);

    if (error) {
      setMessage(
        "Unable to delete resource. Existing bookings may still reference it."
      );
      return;
    }

    await loadResources();
  }

  useEffect(() => {
    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return resources;

    return resources.filter((resource) => {
      return (
        resource.name.toLowerCase().includes(keyword) ||
        resource.type.toLowerCase().includes(keyword) ||
        resource.location.toLowerCase().includes(keyword) ||
        String(resource.capacity ?? "").includes(keyword) ||
        resource.description?.toLowerCase().includes(keyword)
      );
    });
  }, [resources, search]);

  return (
    <AdminProtectedPage>
      <AdminShell>
        <section className="border-b border-white/70 bg-white/50 backdrop-blur">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-8 2xl:px-10">
            <p className="text-sm font-medium text-slate-500">
              Resource Management
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              Manage booking resources.
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Create, organize, and maintain facilities available in SyncSpace.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1600px] px-6 py-8 2xl:px-10">
          {message && (
            <p className="mb-6 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Resource Management
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Search and manage all available booking resources.
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search resources..."
              className="w-full rounded-full border border-white bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 md:max-w-sm"
            />
          </div>

          {loading ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-3xl border border-white/80 bg-white/85 shadow-sm"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setShowAddResource((prev) => !prev)}
                  className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/70 p-5 text-slate-500 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-slate-500 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-4xl font-light text-slate-600">
                    +
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-950">
                    Add Resource
                  </h3>

                  <p className="mt-2 max-w-xs text-center text-sm leading-6 text-slate-500">
                    Create a new room, lab, facility, or equipment resource.
                  </p>
                </button>

                {filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="group rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {resource.type}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950">
                          {resource.name}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          resource.is_available
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {resource.is_available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <p className="min-h-[48px] text-sm leading-6 text-slate-600">
                      {resource.description || "No description provided."}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      <p>
                        <span className="font-medium text-slate-900">
                          Location:
                        </span>{" "}
                        {resource.location}
                      </p>

                      {resource.capacity && (
                        <p>
                          <span className="font-medium text-slate-900">
                            Capacity:
                          </span>{" "}
                          {resource.capacity} pax
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteResource(resource.id)}
                      className="mt-5 inline-flex w-full justify-center rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Delete Resource
                    </button>
                  </div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="mt-6 rounded-3xl border border-white/80 bg-white/85 p-6 text-center text-sm text-slate-500 shadow-sm backdrop-blur">
                  No resources found.
                </div>
              )}

              {showAddResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/80 bg-white p-6 shadow-2xl">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                        <h2 className="text-2xl font-bold text-slate-950">
                            Add New Resource
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Fill in the details for the new booking resource.
                        </p>
                        </div>

                        <button
                        type="button"
                        onClick={() => setShowAddResource(false)}
                        className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
                        >
                        Close
                        </button>
                    </div>

                    <AdminResourceForm onAddResource={handleAddResource} />
                    </div>
                </div>
              )}
            </>
          )}
        </section>
      </AdminShell>
    </AdminProtectedPage>
  );
}