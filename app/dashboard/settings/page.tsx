"use client";

import { CheckCircle2, Linkedin, LogOut, Zap, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import Input from "@/components/Common/Input";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";

function SectionTitle({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {eyebrow}
        </span>
      )}
      <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
        {children}
      </h3>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [linkedinAccount, setLinkedinAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, subscription_plan")
        .eq("id", user.id)
        .single();

      setName(profile?.full_name || "");
      setPlan(profile?.subscription_plan || "free");

      const { data: linkedin } = await supabase
        .from("user_linkedin_accounts")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      setLinkedinAccount(linkedin);
      setLoading(false);

      // Show upgrade success/cancel notifications
      if (searchParams.get("upgraded") === "1") {
        setNotification({
          type: "success",
          message: "🎉 Welcome to your new plan! All features are now unlocked.",
        });
        setTimeout(() => setNotification(null), 5000);
      } else if (searchParams.get("canceled") === "1") {
        setNotification({
          type: "error",
          message: "Upgrade canceled. You're still on the Free plan.",
        });
        setTimeout(() => setNotification(null), 5000);
      }
    })();
  }, [searchParams]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id);
    setSaving(false);
    alert("Settings saved successfully!");
  }, [name]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
  }, [router]);

  const handleDisconnectLinkedIn = useCallback(async () => {
    if (!confirm("Disconnect your LinkedIn account?")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("user_linkedin_accounts")
      .update({ is_active: false })
      .eq("user_id", user.id);
    setLinkedinAccount(null);
  }, []);

  const handleUpgrade = useCallback(async (targetPlan: string) => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setNotification({
          type: "error",
          message: data.error || "Failed to start checkout",
        });
        setUpgrading(false);
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "Network error. Try again.",
      });
      setUpgrading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-neutral-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Account */}
      <Card>
        <SectionTitle>Account</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            disabled
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </div>
      </Card>

      {/* LinkedIn connection */}
      <Card>
        <SectionTitle>LinkedIn connection</SectionTitle>
        {linkedinAccount ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              {linkedinAccount.profile_photo_url ? (
                <img
                  src={linkedinAccount.profile_photo_url}
                  alt={linkedinAccount.profile_name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <Linkedin className="h-5 w-5" />
                </span>
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                  Connected
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {linkedinAccount.profile_name} · {linkedinAccount.profile_email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="/api/auth/linkedin/authorize">
                <Button variant="secondary" size="sm">
                  Reconnect
                </Button>
              </a>
              <Button variant="danger" size="sm" onClick={handleDisconnectLinkedIn}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <Linkedin className="h-5 w-5" />
              </span>
              <p className="text-sm text-neutral-600">
                Connect your LinkedIn to publish posts.
              </p>
            </div>
            <a href="/api/auth/linkedin/authorize">
              <Button>Connect</Button>
            </a>
          </div>
        )}
      </Card>

      {/* Notification */}
      {notification && (
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium",
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-800"
          )}
        >
          {notification.message}
        </div>
      )}

      {/* Plan */}
      <Card>
        <SectionTitle>Subscription Plan</SectionTitle>
        <div className="space-y-4">
          {/* Current Plan */}
          <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink capitalize flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  {plan === "free" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {plan === "free"
                    ? "1 post per week · Limited features"
                    : plan === "starter"
                    ? "$29/month · 50 posts per day · Full features"
                    : plan === "pro"
                    ? "$79/month · 500 posts per day · All features"
                    : "$299/month · Unlimited posts · Priority support"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-ink">
                  {plan === "free" ? "Free" : plan === "starter" ? "$29" : plan === "pro" ? "$79" : "$299"}
                </p>
                {plan !== "free" && <p className="text-xs text-neutral-500">/month</p>}
              </div>
            </div>
          </div>

          {/* Upgrade Options */}
          {plan === "free" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-neutral-700">Upgrade to unlock unlimited generation</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => handleUpgrade("starter")}
                  disabled={upgrading}
                  className="flex items-center justify-between rounded-lg border-2 border-blue-200 bg-white p-3 hover:bg-blue-50 disabled:opacity-50"
                >
                  <div className="text-left">
                    <p className="font-semibold text-sm text-ink">Starter</p>
                    <p className="text-xs text-neutral-500">$29/mo</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleUpgrade("pro")}
                  disabled={upgrading}
                  className="flex items-center justify-between rounded-lg border-2 border-purple-200 bg-purple-50 p-3 hover:bg-purple-100 disabled:opacity-50 ring-2 ring-purple-300"
                >
                  <div className="text-left">
                    <p className="font-semibold text-sm text-ink">Pro</p>
                    <p className="text-xs text-neutral-500">$79/mo</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-600" />
                </button>
                <button
                  onClick={() => handleUpgrade("agency")}
                  disabled={upgrading}
                  className="flex items-center justify-between rounded-lg border-2 border-amber-200 bg-white p-3 hover:bg-amber-50 disabled:opacity-50"
                >
                  <div className="text-left">
                    <p className="font-semibold text-sm text-ink">Agency</p>
                    <p className="text-xs text-neutral-500">$299/mo</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-600" />
                </button>
              </div>
              {upgrading && <p className="text-xs text-neutral-500 text-center">Redirecting to Stripe...</p>}
            </div>
          )}

          {plan !== "free" && (
            <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
              <p className="text-sm font-medium text-emerald-900">✓ Thank you for upgrading!</p>
              <p className="text-xs text-emerald-700 mt-1">
                You can manage your subscription, update payment method, or cancel anytime on Stripe.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Logout */}
      <Card>
        <SectionTitle>Session</SectionTitle>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </Card>
    </div>
  );
}
