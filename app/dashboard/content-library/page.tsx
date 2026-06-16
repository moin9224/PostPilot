"use client";

import { Inbox, Sparkles, Search, Copy, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  industry: string | null;
  created_at: string;
  estimated_reach: number | null;
  hashtags: string[] | null;
}

export default function ContentLibraryPage() {
  const [posts, setPosts] = useState<DBPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: { user } } = await supabase.auth.getUser();
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
  }

  async function handleDelete(id: string) {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.from("generated_posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleCopy(post: DBPost) {
    navigator.clipboard.writeText(post.content);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const filtered = useMemo(() => {
    let result = posts;
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.content.toLowerCase().includes(q));
    }
    return result;
  }, [posts, search, statusFilter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">
            Content Library
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            All your generated posts in one place.
          </p>
        </div>
        <Link href="/dashboard/content-generator">
          <Button>
            <Sparkles className="h-4 w-4" />
            Generate post
          </Button>
        </Link>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "draft", "scheduled", "published"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "border-ink bg-ink text-white"
                  : "border-neutral-200 bg-white text-neutral-600"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-neutral-500">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-500">
              {posts.length === 0
                ? "No posts yet"
                : "No posts match your filters"}
            </p>
            {posts.length === 0 && (
              <Link href="/dashboard/content-generator">
                <Button size="sm" className="mt-4 mx-auto w-fit">
                  <Sparkles className="h-3.5 w-3.5" />
                  Create your first post
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Card key={post.id}>
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={post.status} />
                <div className="flex gap-1">
                  <button
                    onClick={() => handleCopy(post)}
                    className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100"
                    title="Copy"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded p-1.5 text-neutral-500 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-ink line-clamp-6 mb-3">
                {post.content}
              </p>
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                {post.tone && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
                    {post.tone}
                  </span>
                )}
              </div>
              {copiedId === post.id && (
                <p className="mt-2 text-[11px] text-green-600">Copied!</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
