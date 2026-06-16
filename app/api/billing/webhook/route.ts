import type Stripe from "stripe";
import { fail, ok } from "@/lib/api";
import { getStripe } from "@/lib/billing";
import { getAdminSupabase } from "@/lib/supabase-server";
import type { SubscriptionPlan } from "@/lib/db-types";

// Stripe webhooks need the raw request body for signature verification, so we
// read request.text() and verify before trusting anything. Uses the admin
// (service-role) client because there's no user session on a webhook call.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return fail(500, "STRIPE_WEBHOOK_SECRET is not configured.");

  const signature = request.headers.get("stripe-signature");
  if (!signature) return fail(400, "Missing stripe-signature header.");

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "invalid signature";
    return fail(400, `Webhook signature verification failed: ${msg}`);
  }

  const admin = getAdminSupabase();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan as SubscriptionPlan | undefined;
        if (userId && plan) {
          await admin
            .from("profiles")
            .update({
              subscription_plan: plan,
              subscription_started_at: new Date().toISOString(),
              stripe_customer_id:
                typeof session.customer === "string" ? session.customer : null,
            })
            .eq("id", userId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) {
          await admin
            .from("profiles")
            .update({ subscription_plan: "free" })
            .eq("id", userId);
        }
        break;
      }
      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (err) {
    console.error("[billing/webhook] handler error:", err);
    return fail(500, "Webhook handler failed.");
  }

  return ok({ received: true });
}
