import { ApiError, ok, requireUser, route } from "@/lib/api";
import { PLAN_PRICES } from "@/lib/billing";
import type { SubscriptionPlan } from "@/lib/db-types";

export const GET = route(async () => {
  const { user, supabase } = await requireUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("subscription_plan, subscription_started_at, stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (error || !data) throw new ApiError(404, "Profile not found.");

  const plan = data.subscription_plan as SubscriptionPlan;
  return ok({
    plan,
    price: PLAN_PRICES[plan],
    startedAt: data.subscription_started_at,
    hasPaymentMethod: !!data.stripe_customer_id,
  });
});
