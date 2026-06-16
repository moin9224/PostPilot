"use client";

import { CalendarIcon, Clock, Inbox, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import StatusBadge from "@/components/Common/StatusBadge";
import { createBrowserClient } from "@supabase/ssr";

type PostStatus = "draft" | "scheduled" | "published" | "failed";

interface DBPost {
  id: string;
  content: string;
  status: PostStatus;
  tone: string | null;
  scheduled_for: string | null;
  created_at: string;
  estimated_reach: number | null;
}

const STATUS_FILTERS: { value: PostStatus | "all"; label: string }[] = [
  { value: "all", label: "All posts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
];

export default function CalendarPage() {
  const [filter, setFilter] = useState<PostStatus | "all">("scheduled");
  const [posts, setPosts] = useState<DBPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("generated_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setPosts((data as DBPost[]) || []);
      setLoading(false);
    });
  }, []);

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const stats = {
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    drafts: posts.filter((p) => p.status === "draft").length,
    published: posts.filter((p) => p.status === "published").length,
    total: posts.length,
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">
            Content Calendar
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage and schedule your LinkedIn posts.
          </p>
        </div>
        <Link href="/dashboard/content-generator">
          <Button>
            <Sparkles className="h-4 w-4" />
            Generate post
          </Button>
        </Link>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox label="Scheduled" value={stats.scheduled} />
        <StatBox label="Drafts" value={stats.drafts} />
        <StatBox label="Published" value={stats.published} />
        <StatBox label="Total" value={stats.total} />
      </section>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value
                ? "border-ink bg-ink text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <Card padded={false}>
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-neutral-500">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-500">
              No {filter === "all" ? "" : filter} posts yet
            </p>
            <Link href="/dashboard/content-generator">
              <Button size="sm" className="mt-4 mx-auto w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                Create your first post
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {filtered.map((post) => (
              <li
                key={post.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-neutral-50/70"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                  <CalendarIcon className="h-4 w-4 text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink line-clamp-2">
                    {post.content.slice(0, 200)}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-500">
                    {post.scheduled_for && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(post.scheduled_for).toLocaleString()}
                      </span>
                    )}
                    {post.tone && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
                        {post.tone}
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge status={post.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </Card>
  );
}
