"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";

import AdminShell from "../../../components/admin/AdminShell";
import AdminProtectedPage from "../../../components/admin/AdminProtectedPage";

type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadUsers() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role")
      .order("full_name", { ascending: true });

    if (error) {
      setMessage(error.message);
    } else {
      setUsers((data || []) as UserProfile[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return users;

    return users.filter((user) => {
      return (
        user.full_name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.role?.toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  return (
    <AdminProtectedPage>
      <AdminShell>
        <section className="border-b border-white/70 bg-white/50 backdrop-blur">
          <div className="mx-auto w-full max-w-[1600px] px-6 py-8 2xl:px-10">
            <p className="text-sm font-medium text-slate-500">
              User Management
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              Monitor registered users.
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              View user accounts, assigned roles, and platform access levels.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1600px] px-6 py-8 2xl:px-10">
          {message && (
            <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Registered Users
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Search users by name, email, or role.
                </p>
              </div>

              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 md:max-w-sm"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="mt-5 space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-xl bg-slate-200/70"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-950 text-xs uppercase tracking-wide text-white">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-6 text-center text-slate-500"
                        >
                          No matching users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">
                              {user.full_name || "Unknown"}
                            </p>
                          </td>

                          <td className="px-4 py-4 text-slate-700">
                            {user.email || "No email"}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-slate-950 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {user.role || "student"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </AdminShell>
    </AdminProtectedPage>
  );
}