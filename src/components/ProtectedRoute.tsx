import { useEffect } from "react";
import { useRouter } from "next/router";
import api from "@/lib/api";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
      } catch {
        router.replace("/");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
