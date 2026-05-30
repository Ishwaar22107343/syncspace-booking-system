"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter, usePathname } from "next/navigation";

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

  return <>{children}</>;
}