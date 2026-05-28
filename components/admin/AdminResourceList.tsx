type Resource = {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number | null;
  is_available: boolean;
};

type AdminResourceListProps = {
  resources: Resource[];
  onDeleteResource: (resourceId: string) => Promise<void>;
};

export default function AdminResourceList({
  resources,
  onDeleteResource,
}: AdminResourceListProps) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Resource Management
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            View and manage resources available for booking.
          </p>
        </div>

        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
          {resources.length} resources
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500 md:col-span-2">
            No resources found.
          </div>
        ) : (
          resources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
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

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-900">Location:</span>{" "}
                  {resource.location}
                </p>

                <p>
                  <span className="font-medium text-slate-900">Capacity:</span>{" "}
                  {resource.capacity ? `${resource.capacity} pax` : "N/A"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onDeleteResource(resource.id)}
                className="mt-5 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Delete Resource
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}