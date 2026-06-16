import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route } from "@/lib/api";
import { getStripe, stripePriceFor } from "@/lib/billing";

const Body = z.object({
  plan: z.enum(["starter", "pro", "agency"]),
});

export const OPTIONS = () => preflight();

/**
 * Starts a Stripe Checkout session for the requested plan and returns the
 * hosted checkout URL. The actual plan change is applied by the Stripe webhook
 * on `checkout.session.completed` (see app/api/billing/webhook).
 */
export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const { plan } = await parseBody(request, Body);

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", user.id)
    .single();

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: stripePriceFor(plan), quantity: 1 }],
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id
      ? undefined
      : profile?.email ?? user.email ?? undefined,
    success_url: `${appUrl}/dashboard/settings?upgraded=1`,
    cancel_url: `${appUrl}/dashboard/settings?canceled=1`,
    // Carry identity through to the webhook.
    metadata: { user_id: user.id, plan },
    subscription_data: { metadata: { user_id: user.id, plan } },
  });

  return ok({ checkoutUrl: session.url });
});
