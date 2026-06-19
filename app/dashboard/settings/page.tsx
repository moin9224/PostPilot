"use client";

import { CheckCircle2, Linkedin, LogOut, Zap, ArrowRight } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "general", label: "General" },
  { id: "billing", label: "Billing" },
  { id: "linkedin", label: "LinkedIn Actions" },
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");
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
    setNotification({
      type: "success",
      message: "Settings saved successfully!",
    });
    setTimeout(() => setNotification(null), 3000);
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
    setNotification({
      type: "success",
      message: "LinkedIn account disconnected",
    });
    setTimeout(() => setNotification(null), 3000);
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
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-ink">Manage your settings</h1>
        <button className="text-sm text-blue-600 hover:text-blue-700">Feeling stuck?</button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={cn(
            "mb-6 rounded-lg px-4 py-3 text-sm font-medium",
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          {notification.message}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8 border-b border-neutral-200 flex gap-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-ink"
                : "text-neutral-600 hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {/* Full Name */}
          <div className="flex items-start justify-between border-b border-neutral-100 pb-6">
            <div className="max-w-sm">
              <p className="font-semibold text-ink">Full name</p>
              <p className="text-sm text-neutral-600 mt-0.5">Update your profile name</p>
            </div>
            <div className="flex-1 max-w-sm text-right">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start justify-between border-b border-neutral-100 pb-6">
            <div className="max-w-sm">
              <p className="font-semibold text-ink">Email address</p>
              <p className="text-sm text-neutral-600 mt-0.5">This is your login email. <button className="text-blue-600 hover:underline">Contact support</button> to change it.</p>
            </div>
            <div className="flex-1 max-w-sm text-right">
              <p className="text-sm text-neutral-500">{email}</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {/* LinkedIn Actions Tab */}
      {activeTab === "linkedin" && (
        <div className="space-y-6">
          {/* LinkedIn Account */}
          <div className="flex items-start justify-between border-b border-neutral-100 pb-6">
            <div className="max-w-sm">
              <p className="font-semibold text-ink">LinkedIn account</p>
              <p className="text-sm text-neutral-600 mt-0.5">Connect or refresh your LinkedIn account to use PostPilot.</p>
            </div>
            <div className="flex-1 max-w-sm text-right">
              {linkedinAccount ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 justify-end">
                    {linkedinAccount.profile_photo_url ? (
                      <img
                        src={linkedinAccount.profile_photo_url}
                        alt={linkedinAccount.profile_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Linkedin className="h-5 w-5" />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-medium text-sm text-ink">{linkedinAccount.profile_name}</p>
                      <a href={`https://linkedin.com/in/${linkedinAccount.profile_name}`} className="text-xs text-blue-600 hover:underline">
                        View LinkedIn profile →
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <a href="/api/auth/linkedin/authorize">
                      <button className="px-4 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-sm transition-colors border border-blue-200">
                        Refresh
                      </button>
                    </a>
                    <button
                      onClick={handleDisconnectLinkedIn}
                      className="px-4 py-1.5 rounded-lg text-red-600 font-medium text-sm border border-red-300 hover:bg-red-50 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <a href="/api/auth/linkedin/authorize">
                  <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                    Connect LinkedIn
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="flex items-start justify-between border-b border-neutral-100 pb-6">
            <div className="max-w-sm">
              <p className="font-semibold text-ink">Current plan</p>
              <p className="text-sm text-neutral-600 mt-0.5">You are currently on the {plan === "free" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1)} plan</p>
            </div>
            <div className="flex-1 max-w-sm text-right">
              <p className="font-semibold text-ink capitalize">
                {plan === "free" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1)}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                {plan === "free"
                  ? "1 post/week"
                  : plan === "starter"
                  ? "50 posts/day - $29/month"
                  : plan === "pro"
                  ? "500 posts/day - $79/month"
                  : "Unlimited - $299/month"}
              </p>
            </div>
          </div>

          {/* Upgrade Plans */}
          {plan === "free" && (
            <>
              <div className="border-b border-neutral-100 pb-6">
                <p className="font-semibold text-ink mb-4">Choose your plan</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Starter */}
                  <button
                    onClick={() => handleUpgrade("starter")}
                    disabled={upgrading}
                    className="rounded-lg border border-neutral-300 bg-white p-6 text-left hover:border-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="font-semibold text-ink mb-3">Starter</p>
                    <p className="text-2xl font-bold text-ink mb-0.5">$29</p>
                    <p className="text-xs text-neutral-500 mb-4">/month</p>
                    <p className="text-sm text-neutral-600 mb-4">50 posts/day</p>
                    <button className="w-full px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors">
                      Choose plan
                    </button>
                  </button>

                  {/* Pro (Highlighted) */}
                  <button
                    onClick={() => handleUpgrade("pro")}
                    disabled={upgrading}
                    className="rounded-lg border border-neutral-300 bg-white text-left hover:border-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="bg-amber-600 text-white text-xs font-semibold text-center py-2">
                      Most Popular
                    </div>
                    <div className="p-6">
                      <p className="font-semibold text-ink mb-3">Pro</p>
                      <p className="text-2xl font-bold text-ink mb-0.5">$79</p>
                      <p className="text-xs text-neutral-500 mb-4">/month</p>
                      <p className="text-sm text-neutral-600 mb-4">500 posts/day</p>
                      <button className="w-full px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors">
                        Choose plan
                      </button>
                    </div>
                  </button>

                  {/* Agency */}
                  <button
                    onClick={() => handleUpgrade("agency")}
                    disabled={upgrading}
                    className="rounded-lg border border-neutral-300 bg-white p-6 text-left hover:border-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="font-semibold text-ink mb-3">Agency</p>
                    <p className="text-2xl font-bold text-ink mb-0.5">$299</p>
                    <p className="text-xs text-neutral-500 mb-4">/month</p>
                    <p className="text-sm text-neutral-600 mb-4">Unlimited</p>
                    <button className="w-full px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors">
                      Choose plan
                    </button>
                  </button>
                </div>
              </div>
            </>
          )}

          {plan !== "free" && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
              <p className="font-semibold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Enjoy your upgraded plan!
              </p>
              <p className="text-sm text-emerald-800 mt-1">
                Manage your subscription or cancel anytime on Stripe.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sign Out Button - Bottom */}
      <div className="mt-12 pt-6 border-t border-neutral-200 flex justify-between items-center">
        <div>
          <p className="font-semibold text-ink">Sign out</p>
          <p className="text-sm text-neutral-600 mt-0.5">Sign out from your account</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink font-medium text-sm transition-colors flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
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
