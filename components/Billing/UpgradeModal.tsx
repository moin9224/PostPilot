"use client";

import { AlertCircle, Check, X, Zap } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Common/Button";
import Modal from "@/components/Common/Modal";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: "free" | "starter" | "pro" | "agency";
  usageInfo: {
    limit: number;
    used: number;
    period: "day" | "week";
  };
}

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Great for new creators",
    limits: "50 posts/day",
    color: "blue",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "For serious content creators",
    limits: "500 posts/day",
    color: "purple",
    badge: "Most Popular",
  },
  {
    id: "agency",
    name: "Agency",
    price: "$299",
    period: "/month",
    description: "For agencies & teams",
    limits: "Unlimited posts",
    color: "amber",
  },
];

const FEATURES = [
  { name: "LinkedIn post generation", free: true, starter: true, pro: true, agency: true },
  { name: "Content scheduling", free: false, starter: true, pro: true, agency: true },
  { name: "Analytics & insights", free: false, starter: true, pro: true, agency: true },
  { name: "Post templates", free: false, starter: true, pro: true, agency: true },
  { name: "Team collaboration", free: false, starter: false, pro: true, agency: true },
  { name: "Priority support", free: false, starter: false, pro: false, agency: true },
];

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  usageInfo,
}: UpgradeModalProps) {
  const [upgrading, setUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "agency">("pro");

  async function handleUpgrade() {
    if (!selectedPlan || selectedPlan === currentPlan) return;
    setUpgrading(true);

    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Failed to start checkout. Try again.");
        setUpgrading(false);
      }
    } catch (err) {
      alert("Network error. Try again.");
      setUpgrading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade Your Plan"
      size="lg"
      footer={null}
    >
      <div className="space-y-6">
        {/* Usage Alert */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">
              You've reached your limit
            </p>
            <p className="mt-0.5 text-sm text-amber-800">
              Free plan: <strong>1 post per week</strong>. You've used{" "}
              <strong>{usageInfo.used} of {usageInfo.limit}</strong> posts this{" "}
              {usageInfo.period}.
            </p>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700">
            Choose a plan to unlock unlimited generation
          </h3>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={cn(
                  "relative rounded-xl border-2 p-4 text-left transition-all",
                  selectedPlan === plan.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-3">
                  <h4 className="font-bold text-neutral-900">{plan.name}</h4>
                  <p className="text-xs text-neutral-500">{plan.description}</p>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-xs text-neutral-500">{plan.period}</span>
                </div>
                <div className="text-xs font-medium text-neutral-600 bg-neutral-50 px-2 py-1 rounded">
                  {plan.limits}
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Stack */}
          <div className="md:hidden space-y-2">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={cn(
                  "relative w-full rounded-lg border-2 p-3 text-left transition-all",
                  selectedPlan === plan.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-neutral-200 bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">
                      {plan.name}
                    </h4>
                    <p className="text-xs text-neutral-500">{plan.price}/mo</p>
                  </div>
                  <span className="text-xs font-medium text-neutral-600">
                    {plan.limits}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-neutral-700">
            What's included
          </h3>
          <div className="space-y-1.5">
            {FEATURES.map((feature) => (
              <div
                key={feature.name}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="text-neutral-600">{feature.name}</span>
                {selectedPlan === "starter" && (
                  feature.starter ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <X className="h-4 w-4 text-neutral-300" />
                  )
                )}
                {selectedPlan === "pro" && (
                  feature.pro ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <X className="h-4 w-4 text-neutral-300" />
                  )
                )}
                {selectedPlan === "agency" && (
                  feature.agency ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <X className="h-4 w-4 text-neutral-300" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Stay on Free Plan
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={upgrading || selectedPlan === currentPlan}
            className={cn(
              "flex-1 flex items-center justify-center gap-2",
              upgrading && "opacity-75 cursor-not-allowed"
            )}
          >
            <Zap className="h-4 w-4" />
            {upgrading ? "Redirecting to Stripe..." : `Upgrade to ${selectedPlan}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
