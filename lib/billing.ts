import Stripe from "stripe";
import { ApiError } from "./api";
import type { SubscriptionPlan } from "./db-types";

export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  free: 0,
  starter: 29,
  pro: 79,
  agency: 299,
};

/** Map a plan to its configured Stripe price ID (env-driven). */
export function stripePriceFor(plan: Exclude<SubscriptionPlan, "free">): string {
  const map: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
    agency: process.env.STRIPE_PRICE_AGENCY,
  };
  const id = map[plan];
  if (!id) throw new ApiError(500, `No Stripe price configured for ${plan}.`);
  return id;
}

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new ApiError(500, "STRIPE_SECRET_KEY is not configured.");
  }
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}
