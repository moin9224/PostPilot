"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/Common/Loading";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate handling the OAuth callback, then redirect into the app.
    const t = setTimeout(() => router.push("/dashboard"), 1500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <Spinner className="h-8 w-8" />
      <div>
        <h1 className="text-lg font-semibold text-ink">
          Connecting your LinkedIn account…
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Hang tight, this only takes a moment.
        </p>
      </div>
    </div>
  );
}
