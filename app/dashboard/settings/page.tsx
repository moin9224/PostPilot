"use client";

import { CheckCircle2, Linkedin, LogOut, Zap, ArrowRight, Lock, User, CreditCard } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";

function SettingsContent() {
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

  const getPlanColor = (p: string) => {
    switch (p) {
      case "starter": return "from-blue-50 to-blue-100 border-blue-300";
      case "pro": return "from-purple-50 to-purple-100 border-purple-300";
      case "agency": return "from-amber-50 to-amber-100 border-amber-300";
      default: return "from-neutral-50 to-neutral-100 border-neutral-300";
    }
  };

  const getPlanBadgeColor = (p: string) => {
    switch (p) {
      case "starter": return "bg-blue-100 text-blue-700";
      case "pro": return "bg-purple-100 text-purple-700";
      case "agency": return "bg-amber-100 text-amber-700";
      default: return "bg-neutral-100 text-neutral-700";
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Notification */}
      {notification && (
        <div
          className={cn(
            "mb-6 rounded-xl px-4 py-3 text-sm font-medium animate-fade-in",
            notification.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          )}
        >
          {notification.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Sidebar */}
        <div className="space-y-4">
          {/* Account Profile Card */}
          <div className="rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {name.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink text-sm truncate">{name || "User"}</p>
                <p className="text-xs text-neutral-500 truncate">{email}</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-neutral-100 pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Current Plan</p>
                <div className={cn("px-3 py-1.5 rounded-lg inline-flex", getPlanBadgeColor(plan))}>
                  <p className="text-sm font-semibold capitalize">{plan === "free" ? "Free" : plan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-900">Generation Limit</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {plan === "free" ? "1" : plan === "starter" ? "50" : plan === "pro" ? "500" : "∞"}
            </p>
            <p className="text-xs text-blue-700 mt-1">{plan === "free" ? "per week" : "per day"}</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-ink" />
              <h2 className="text-lg font-semibold text-ink">Profile Settings</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-ink placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-500 cursor-not-allowed"
                />
                <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* LinkedIn Connection */}
          <div className="rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Linkedin className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-ink">LinkedIn Connection</h2>
            </div>

            {linkedinAccount ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                  {linkedinAccount.profile_photo_url ? (
                    <img
                      src={linkedinAccount.profile_photo_url}
                      alt={linkedinAccount.profile_name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Linkedin className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="flex items-center gap-2 font-semibold text-ink">
                      {linkedinAccount.profile_name}
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    </p>
                    <p className="text-sm text-neutral-600">{linkedinAccount.profile_email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href="/api/auth/linkedin/authorize" className="flex-1">
                    <button className="w-full px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink font-medium transition-colors">
                      Reconnect
                    </button>
                  </a>
                  <button
                    onClick={handleDisconnectLinkedIn}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors border border-red-200"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Linkedin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-ink">No LinkedIn account connected</p>
                    <p className="text-sm text-neutral-600">Connect your LinkedIn to publish posts automatically</p>
                  </div>
                </div>
                <a href="/api/auth/linkedin/authorize">
                  <button className="w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                    Connect LinkedIn
                  </button>
                </a>
              </div>
            )}
          </div>

          {/* Billing & Plan */}
          <div className="rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-ink">Billing & Plan</h2>
            </div>

            {/* Current Plan Display */}
            <div className={cn("rounded-xl border-2 p-6 mb-6 bg-gradient-to-br", getPlanColor(plan))}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-amber-600" />
                    <p className="text-2xl font-bold text-ink capitalize">
                      {plan === "free" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                    </p>
                  </div>
                  <p className="text-neutral-700 text-sm">
                    {plan === "free"
                      ? "1 post per week • Limited features"
                      : plan === "starter"
                      ? "50 posts per day • Full features"
                      : plan === "pro"
                      ? "500 posts per day • All features + Analytics"
                      : "Unlimited posts • Priority support"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-ink">
                    {plan === "free" ? "Free" : "$" + (plan === "starter" ? "29" : plan === "pro" ? "79" : "299")}
                  </p>
                  {plan !== "free" && <p className="text-sm text-neutral-600">/month</p>}
                </div>
              </div>
            </div>

            {/* Upgrade Options */}
            {plan === "free" && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-neutral-700 mb-4">Ready to scale? Upgrade now</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {/* Starter */}
                  <button
                    onClick={() => handleUpgrade("starter")}
                    disabled={upgrading}
                    className="relative group rounded-lg border-2 border-blue-300 bg-white p-4 text-left hover:shadow-md hover:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="font-semibold text-ink mb-1">Starter</p>
                    <p className="text-2xl font-bold text-blue-600 mb-2">$29</p>
                    <p className="text-xs text-neutral-600">50 posts/day</p>
                    <div className="absolute top-3 right-3 text-blue-600 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Pro (Highlighted) */}
                  <button
                    onClick={() => handleUpgrade("pro")}
                    disabled={upgrading}
                    className="relative group rounded-lg border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 p-4 text-left hover:shadow-lg hover:border-purple-500 transition-all ring-2 ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute -top-3 left-4 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">Most Popular</div>
                    <p className="font-semibold text-ink mb-1 mt-2">Pro</p>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$79</p>
                    <p className="text-xs text-neutral-600">500 posts/day</p>
                    <div className="absolute top-4 right-3 text-purple-600 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Agency */}
                  <button
                    onClick={() => handleUpgrade("agency")}
                    disabled={upgrading}
                    className="relative group rounded-lg border-2 border-amber-300 bg-white p-4 text-left hover:shadow-md hover:border-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="font-semibold text-ink mb-1">Agency</p>
                    <p className="text-2xl font-bold text-amber-600 mb-2">$299</p>
                    <p className="text-xs text-neutral-600">Unlimited</p>
                    <div className="absolute top-3 right-3 text-amber-600 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </button>
                </div>
                {upgrading && <p className="text-sm text-center text-neutral-500 mt-4">Redirecting to Stripe...</p>}
              </div>
            )}

            {plan !== "free" && (
              <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">You're all set!</p>
                    <p className="text-sm text-emerald-800 mt-0.5">
                      Manage billing, change payment method, or cancel anytime on Stripe.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl bg-white border border-red-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-ink">Danger Zone</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Sign out of your account on this device</p>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium border border-red-200 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-neutral-500">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
