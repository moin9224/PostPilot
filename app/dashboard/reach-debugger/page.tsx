"use client";

import { Stethoscope, Inbox } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";

export default function ReachDebuggerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleAnalyze() {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reach-debugger/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postUrl: url }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Failed to analyze");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">
          Reach Debugger
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Analyze why your posts aren't getting the reach they deserve.
        </p>
      </header>

      <Card>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Paste your LinkedIn post URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
          />
          <Button onClick={handleAnalyze} loading={loading} disabled={!url.trim()}>
            Analyze
          </Button>
        </div>
      </Card>

      {!result && !loading && (
        <Card>
          <div className="py-12 text-center">
            <Stethoscope className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-500">
              No analysis yet
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Paste a LinkedIn post URL to start analyzing its reach.
            </p>
          </div>
        </Card>
      )}

      {result && (
        <Card>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
