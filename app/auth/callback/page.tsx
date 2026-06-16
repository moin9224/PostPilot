"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/Common/Loading";
import { createClient } from "@/lib/supabase";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const supabase = createClient();

        // Get the session from the URL hash
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          // Try to exchange the code for a session
          const params = new URLSearchParams(window.location.hash.slice(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          const expiresIn = params.get("expires_in");

          if (accessToken) {
            const { error: setSessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || "",
              });

            if (setSessionError) throw setSessionError;
          } else {
            throw new Error("No session data found");
          }
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Authentication failed"
        );
      }
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div>
          <h1 className="text-lg font-semibold text-red-600">Error</h1>
          <p className="mt-1 text-sm text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 text-action hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <Spinner className="h-8 w-8" />
      <div>
        <h1 className="text-lg font-semibold text-ink">
          Signing you in…
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Hang tight, this only takes a moment.
        </p>
      </div>
    </div>
  );
}
