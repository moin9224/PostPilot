import { z } from "zod";
import { ApiError, ok, parseBody, preflight, requireUser, route } from "@/lib/api";

const Body = z.object({
  text: z.string().min(1, "Post content is required."),
  scheduledFor: z.string().datetime({ message: "scheduledFor must be ISO 8601." }),
  linkedinAccountId: z.string().uuid("Must specify a LinkedIn account."),
  hashtags: z.array(z.string()).optional(),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const { text, scheduledFor, linkedinAccountId, hashtags } = await parseBody(
    request,
    Body,
  );

  // Verify the LinkedIn account exists, belongs to the user, and is active
  const { data: account, error: accountError } = await supabase
    .from("user_linkedin_accounts")
    .select("id, is_active")
    .eq("id", linkedinAccountId)
    .eq("user_id", user.id)
    .single();

  if (accountError || !account) {
    throw new ApiError(404, "LinkedIn account not found or not active.");
  }

  if (!account.is_active) {
    throw new ApiError(400, "LinkedIn account is not active. Please reconnect.");
  }

  // Verify the scheduled time is in the future
  const scheduledTime = new Date(scheduledFor).getTime();
  if (scheduledTime <= Date.now()) {
    throw new ApiError(400, "Scheduled time must be in the future.");
  }

  // Insert into scheduled_posts_v2 for the cron worker to pick up
  const { data, error } = await supabase
    .from("scheduled_posts_v2")
    .insert({
      user_id: user.id,
      linkedin_account_id: linkedinAccountId,
      text,
      hashtags: hashtags ?? null,
      scheduled_for: scheduledFor,
      status: "scheduled",
    })
    .select("id, scheduled_for")
    .single();

  if (error) throw new Error(error.message);

  return ok({
    postId: data.id,
    scheduledFor: data.scheduled_for,
    message: "Post scheduled successfully. It will be published at the scheduled time."
  }, 201);
});
