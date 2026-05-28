"use client";

import { useState } from "react";

type AdminResourceFormProps = {
  onAddResource: (resource: {
    name: string;
    type: string;
    location: string;
    capacity: number | null;
    description: string;
  }) => Promise<void>;
};

export default function AdminResourceForm({
  onAddResource,
}: AdminResourceFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !type || !location || !description) return;

    setAdding(true);

    await onAddResource({
      name,
      type,
      location,
      capacity: capacity ? Number(capacity) : null,
      description,
    });

    setName("");
    setType("");
    setLocation("");
    setCapacity("");
    setDescription("");
    setAdding(false);
  }

  return (
    <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur">
      <h2 className="text-xl font-bold text-slate-950">Add Resource</h2>
      <p className="mt-1 text-sm text-slate-600">
        Create a new room, facility, or equipment item for users to book.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        <input
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="Resource name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="Type e.g. Meeting Room"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <input
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="Capacity"
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        <textarea
          className="min-h-24 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 md:col-span-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          disabled={adding}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60 md:col-span-2"
        >
          {adding ? "Adding Resource..." : "Add Resource"}
        </button>
      </form>
    </div>
  );
}