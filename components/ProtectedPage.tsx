"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { DashboardSkeleton, BookingsSkeleton, ResourcePageSkeleton } from "./Skeleton";

type SkeletonType = "dashboard" | "bookings" | "resource" | "none";

function getSkeletonType(pathname: string): SkeletonType {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname === "/bookings") return "bookings";
  if (pathname.startsWith("/resources/")) return "resource";
  return "none";
}

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const skeletonType = getSkeletonType(pathname);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      setChecking(false);
    }

    checkUser();
  }, [router]);

  if (checking) {
    if (skeletonType === "dashboard") return <DashboardSkeleton />;
    if (skeletonType === "bookings") return <BookingsSkeleton />;
    if (skeletonType === "resource") return <ResourcePageSkeleton />;
    // Generic fade-in placeholder for other pages
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_30%),radial-gradient(circle_at_top_right,#fce7f3,transparent_26%),linear-gradient(to_bottom,#f8fafc,#eef2f7)]" />
    );
  }

  return <>{children}</>;
}