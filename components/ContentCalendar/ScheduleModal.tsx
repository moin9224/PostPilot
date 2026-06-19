"use client";

import { Calendar, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/Common/Button";
import Modal from "@/components/Common/Modal";
import Select from "@/components/Common/Select";
import { cn } from "@/lib/utils";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "UTC", label: "UTC" },
];

interface LinkedInAccount {
  id: string;
  profile_name: string;
}

/** Tomorrow's date as YYYY-MM-DD in local time — the earliest valid schedule date. */
function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Today as YYYY-MM-DD — used as the `min` attribute. */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preview?: string;
  busy?: boolean;
  onSchedule: (when: { date: string; time: string; tz: string; linkedinAccountId: string }) => void;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  preview,
  busy = false,
  onSchedule,
}: ScheduleModalProps) {
  // Default to tomorrow at 9 AM so the field is never blank and is always valid.
  const [date, setDate] = useState(tomorrowStr);
  const [time, setTime] = useState("09:00");
  const [tz, setTz] = useState(() => {
    // Best-effort: detect the user's local IANA timezone.
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (TIMEZONES.some((t) => t.value === local)) return local;
    } catch {}
    return "UTC";
  });
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<LinkedInAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  useEffect(() => {
    if (isOpen && accounts.length === 0) {
      fetchAccounts();
    }
  }, [isOpen, accounts.length]);

  async function fetchAccounts() {
    setLoadingAccounts(true);
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok && data.linkedinAccounts) {
        setAccounts(data.linkedinAccounts);
        if (data.linkedinAccounts.length > 0) {
          setSelectedAccount(data.linkedinAccounts[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch LinkedIn accounts:", err);
    } finally {
      setLoadingAccounts(false);
    }
  }

  // Human-readable summary shown in the modal so the user can confirm
  // exactly when the post will go out before clicking Schedule.
  const readableDate =
    date
      ? new Date(`${date}T${time}`).toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";

  function handleSchedule() {
    if (!selectedAccount) {
      setError("Please connect a LinkedIn account first.");
      return;
    }
    if (!date) {
      setError("Please pick a date.");
      return;
    }
    // Guard: the selected date+time must be in the future.
    const chosen = new Date(`${date}T${time}`);
    if (chosen <= new Date()) {
      setError("Please pick a date and time in the future.");
      return;
    }
    setError("");
    onSchedule({ date, time, tz, linkedinAccountId: selectedAccount });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule post"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={busy}
            className="bg-ink hover:bg-neutral-800"
          >
            {busy ? "Scheduling…" : "Confirm schedule"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Post preview */}
        {preview && (
          <div className="max-h-28 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-[13px] leading-relaxed text-neutral-700 line-clamp-4">
            {preview}
          </div>
        )}

        {/* LinkedIn Account */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            LinkedIn Account
          </label>
          {accounts.length === 0 ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">No LinkedIn account connected</p>
                <p className="mt-0.5">Please connect your LinkedIn account in Settings → Integrations first.</p>
              </div>
            </div>
          ) : (
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-action/40"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.profile_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Date
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="date"
              value={date}
              min={todayStr()}
              onChange={(e) => {
                setDate(e.target.value);
                setError("");
              }}
              className={cn(
                "h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-action/40",
                error ? "border-red-400" : "border-neutral-200",
              )}
            />
          </div>
          {error && (
            <p className="mt-1.5 text-[12px] text-red-500">{error}</p>
          )}
        </div>

        {/* Time */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Time
          </label>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 bg-white pl-9 pr-3 text-sm text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-action/40"
            />
          </div>
        </div>

        {/* Timezone */}
        <Select
          label="Timezone"
          options={TIMEZONES}
          value={tz}
          onChange={(e) => setTz(e.target.value)}
        />

        {/* Confirmation summary */}
        {date && !error && (
          <div className="rounded-lg bg-emerald-50 px-4 py-3 text-[12px] text-emerald-800 ring-1 ring-inset ring-emerald-100">
            <span className="font-semibold">Will post on </span>
            {readableDate} at {time}{" "}
            <span className="text-emerald-600">
              ({TIMEZONES.find((t) => t.value === tz)?.label ?? tz})
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
