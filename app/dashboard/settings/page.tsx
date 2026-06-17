"use client";

import { CheckCircle2, Linkedin, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import Input from "@/components/Common/Input";
import { createBrowserClient } from "@supabase/ssr";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Free");
  const [linkedinAccount, setLinkedinAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      setPlan(profile?.subscription_plan || "Free");

      const { data: linkedin } = await supabase
        .from("user_linkedin_accounts")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      setLinkedinAccount(linkedin);
      setLoading(false);
    })();
  }, []);

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

      {/* Plan */}
      <Card>
        <SectionTitle>Plan</SectionTitle>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-neutral-50 p-4">
          <div>
            <p className="text-sm font-medium text-ink capitalize">{plan} plan</p>
            <p className="text-xs text-neutral-500">
              Manage your subscription.
            </p>
          </div>
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
