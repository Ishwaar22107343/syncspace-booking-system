"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAuth() {
    setLoading(true);
    setMessage("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          email,
        });

        if (profileError) {
          setMessage(profileError.message);
          setLoading(false);
          return;
        }
      }

      router.push("/dashboard");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">
          {isLogin ? "Welcome back" : "Create your SyncSpace account"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {isLogin
            ? "Login to manage your bookings."
            : "Sign up to start booking shared spaces."}
        </p>

        <div className="mt-6 space-y-4">
          {!isLogin && (
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign up"}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm text-slate-600 hover:text-slate-900"
          >
            {isLogin
              ? "New here? Create an account"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </main>
  );
}