import Link from "next/link";
import { BarChart3, Eye, Heart, MessageCircle, Sparkles, TrendingUp, Inbox } from "lucide-react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import { getServerSupabase } from "@/lib/supabase-server";

export default async function AnalyticsPage() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let posts: any[] = [];
  if (user) {
    const { data } = await supabase
      .from("generated_posts")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    posts = data || [];
  }

  const totalReach = posts.reduce((s, p) => s + (p.estimated_reach || 0), 0);
  const totalEngagements = posts.reduce(
    (s, p) =>
      s + (p.likes_count || 0) + (p.comments_count || 0) + (p.shares_count || 0),
    0,
  );
  const totalComments = posts.reduce((s, p) => s + (p.comments_count || 0), 0);
  const totalShares = posts.reduce((s, p) => s + (p.shares_count || 0), 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-ink">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track your LinkedIn performance.
          </p>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total reach"
          value={totalReach.toLocaleString()}
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Engagements"
          value={totalEngagements.toLocaleString()}
          icon={<Heart className="h-5 w-5" />}
        />
        <StatCard
          label="Comments"
          value={totalComments.toLocaleString()}
          icon={<MessageCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Shares"
          value={totalShares.toLocaleString()}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </section>

      <Card padded={false}>
        <div className="border-b border-neutral-100 px-4 sm:px-6 py-4">
          <h3 className="text-base font-semibold text-ink">
            Top performing posts
          </h3>
          <p className="mt-1 text-xs text-neutral-500">Published content</p>
        </div>

        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-500">
              No published posts yet
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Publish posts to see analytics here.
            </p>
            <Link href="/dashboard/content-generator">
              <Button size="sm" className="mt-4 mx-auto w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                Generate post
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {posts.slice(0, 20).map((post) => (
              <li
                key={post.id}
                className="flex items-start gap-4 px-4 sm:px-6 py-4 hover:bg-neutral-50/70"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink line-clamp-2">
                    {(post.content || "").slice(0, 150)}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {(post.estimated_reach || 0).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments_count || 0}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
        </div>
        <div className="rounded-lg p-3 bg-neutral-100 text-neutral-600">
          {icon}
        </div>
      </div>
    </Card>
  );
}
