"use client";

import { useEffect, useState } from "react";

type Resource = {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  capacity?: number;
};

export default function ResourceHeader({ resource }: { resource: Resource }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true));
    });
  }, []);

  return (
    <section className="border-b border-white/70 bg-white/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p
          className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 280ms ease, transform 280ms ease",
          }}
        >
          {resource.type}
        </p>

        <h1
          className="mt-2 text-3xl font-bold text-slate-950"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 300ms ease 50ms, transform 300ms ease 50ms",
          }}
        >
          {resource.name}
        </h1>

        <p
          className="mt-3 max-w-2xl text-slate-600"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 300ms ease 100ms, transform 300ms ease 100ms",
          }}
        >
          {resource.description}
        </p>

        <div
          className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 300ms ease 150ms, transform 300ms ease 150ms",
          }}
        >
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
  );
}