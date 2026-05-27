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

    if (!email || !password || (!isLogin && !fullName)) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

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

      router.push("/dashboard?intro=true");
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

      router.push("/dashboard?intro=true");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),radial-gradient(circle_at_bottom_right,#fce7f3,transparent_28%),linear-gradient(to_bottom,#f8fafc,#eef2f7)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/85 p-8 shadow-xl backdrop-blur">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">SyncSpace</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin
              ? "Login to manage your bookings."
              : "Sign up to start booking shared spaces."}
          </p>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign up"}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="w-full text-sm text-slate-600 transition hover:text-slate-950"
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