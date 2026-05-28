"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/resources", label: "Resources" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/users", label: "Users" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]">
      <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-sm">
              S
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">SyncSpace</p>
              <p className="text-xs text-slate-500">Admin Console</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              User View
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {children}
    </main>
  );
}