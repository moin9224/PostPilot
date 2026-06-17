import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase-server";
import { publishToLinkedIn } from "@/lib/linkedin";

// Always run on the server at request time, never cached/statically optimized.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Allow the worker enough time to publish a batch sequentially.
export const maxDuration = 60;

/**
 * Cron worker that publishes due scheduled posts to LinkedIn.
 *
 * Triggered by Vercel Cron (see vercel.json). Vercel sends an
 * `Authorization: Bearer <CRON_SECRET>` header; we reject anything else so the
 * endpoint can't be invoked by the public. Uses the service-role client to
 * bypass RLS and read every user's due posts.
 *
 * For each due post we publish via the shared helper and record the outcome on
 * the row (`published` / `failed` + `publish_error`) so nothing fails silently
 * and a post is never double-published.
 */
export const GET = async (request: Request) => {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const admin = getAdminSupabase();
  const nowIso = new Date().toISOString();

  // Pull a bounded batch of due posts. Joining the account row gives us the
  // token in a single query.
  const { data: duePosts, error } = await admin
    .from("scheduled_posts_v2")
    .select(
      "id, user_id, linkedin_account_id, text, account:user_linkedin_accounts(linkedin_id, access_token, token_expires_at, is_active)",
    )
    .eq("status", "scheduled")
    .lte("scheduled_for", nowIso)
    .order("scheduled_for", { ascending: true })
    .limit(25);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: { id: string; status: "published" | "failed"; error?: string }[] = [];

  for (const post of duePosts ?? []) {
    // supabase returns the joined relation as an array or object depending on
    // the relationship; normalize to a single account row.
    const account = Array.isArray(post.account) ? post.account[0] : post.account;

    // Claim the row first (scheduled -> publishing) so a concurrent cron run
    // can't grab the same post. If the update affects 0 rows, skip it.
    const { data: claimed } = await admin
      .from("scheduled_posts_v2")
      .update({ status: "publishing", updated_at: new Date().toISOString() })
      .eq("id", post.id)
      .eq("status", "scheduled")
      .select("id")
      .maybeSingle();

    if (!claimed) continue;

    const finalize = async (
      status: "published" | "failed",
      extra: Record<string, unknown>,
    ) => {
      await admin
        .from("scheduled_posts_v2")
        .update({ status, updated_at: new Date().toISOString(), ...extra })
        .eq("id", post.id);
      results.push({ id: post.id, status, error: extra.publish_error as string | undefined });
    };

    if (!account || account.is_active === false) {
      await finalize("failed", {
        publish_error: "No active LinkedIn account connected for this post.",
      });
      continue;
    }

    const result = await publishToLinkedIn(account, post.text);

    if (result.ok) {
      await finalize("published", {
        published_at: new Date().toISOString(),
        linkedin_post_id: result.linkedinPostId,
        publish_error: null,
      });
    } else {
      await finalize("failed", { publish_error: result.error });
    }
  }

  return NextResponse.json({
    processed: results.length,
    published: results.filter((r) => r.status === "published").length,
    failed: results.filter((r) => r.status === "failed").length,
    results,
  });
};
