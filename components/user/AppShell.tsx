"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [progress, setProgress] = useState(0);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setProgress(100);

    const timer = setTimeout(() => {
      setProgress(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    async function loadRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(data?.role || null);
    }

    loadRole();
  }, []);

  function handleNavClick() {
    setProgress(40);

    setTimeout(() => {
      setProgress(70);
    }, 150);
  }

  async function handleLogout() {
    setProgress(60);
    await supabase.auth.signOut();
    router.push("/auth");
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/bookings", label: "My Bookings" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]">
      <div
        className="pointer-events-none fixed left-0 top-0 z-50 h-[2px] bg-gradient-to-r from-sky-400 via-indigo-500 to-pink-400"
        style={{
          width: `${progress}%`,
          opacity: progress > 0 && progress < 100 ? 1 : 0,
          transition:
            progress === 0
              ? "none"
              : progress === 100
              ? "width 200ms ease, opacity 300ms ease 200ms"
              : "width 600ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex mx-auto w-full max-w-[1600px] items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            onClick={handleNavClick}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-sm">
              S
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950">SyncSpace</p>
              <p className="text-xs text-slate-500">Resource booking</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {role === "admin" && (
              <Link
                href="/admin"
                onClick={handleNavClick}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  pathname === "/admin"
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Admin Console
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.97]"
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