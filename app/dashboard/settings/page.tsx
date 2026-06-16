"use client";

import { CheckCircle2, Linkedin } from "lucide-react";
import { useCallback, useState } from "react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";
import { CURRENT_USER } from "@/lib/mock";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
];

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "3x", label: "3x per week" },
  { value: "weekly", label: "Weekly" },
];

function Toggle({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description?: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
          on ? "bg-ink" : "bg-neutral-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

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
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [frequency, setFrequency] = useState("3x");
  const [timezone, setTimezone] = useState("America/New_York");
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 600);
  }, []);

  const confirmDelete = useCallback(() => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      alert("Account deletion requested.");
    }
  }, []);

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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} loading={saving}>Save changes</Button>
        </div>
      </Card>

      {/* LinkedIn connection */}
      <Card>
        <SectionTitle>LinkedIn connection</SectionTitle>
        <div className="flex items-center justify-between rounded-md border border-edge p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
              <Linkedin className="h-5 w-5" />
            </span>
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                Connected
                <CheckCircle2 className="h-4 w-4 text-success" />
              </p>
              <p className="text-xs text-gray-500">
                {CURRENT_USER.name} (@{CURRENT_USER.linkedinHandle})
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => alert("Redirecting to LinkedIn OAuth...")}>
            Reconnect
          </Button>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <SectionTitle>Preferences</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Default posting frequency"
            options={FREQUENCIES}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
          <Select
            label="Timezone"
            options={TIMEZONES}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>
        <div className="mt-4 divide-y divide-edge border-t border-edge">
          <Toggle
            label="Email notifications"
            description="Get notified when posts publish or fail."
            defaultOn
          />
          <Toggle
            label="Weekly summary"
            description="A digest of your performance every Monday."
            defaultOn
          />
          <Toggle
            label="Dark mode"
            description="Use a darker theme across the app."
          />
        </div>
      </Card>

      {/* Billing */}
      <Card>
        <SectionTitle>Billing</SectionTitle>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-mist p-4">
          <div>
            <p className="text-sm font-medium text-ink">Pro — $79/month</p>
            <p className="text-xs text-gray-500">Next billing: Jul 15, 2026</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => alert("Redirecting to upgrade page...")}>Upgrade</Button>
            <Button size="sm" variant="secondary" onClick={() => alert("Redirecting to downgrade page...")}>
              Downgrade
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => alert("Subscription cancellation requested.")}>
            Cancel subscription
          </Button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-error/30">
        <SectionTitle>
          <span className="text-error">Danger zone</span>
        </SectionTitle>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            Permanently delete your account and all data. This cannot be undone.
          </p>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Delete account
          </Button>
        </div>
      </Card>
    </div>
  );
}
