"use client";

import { Mail, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Common/Button";
import Card from "@/components/Common/Card";
import Input from "@/components/Common/Input";
import Select from "@/components/Common/Select";
import { TEAM_MEMBERS } from "@/lib/mock";
import type { Role, TeamMember } from "@/lib/types";
import { isValidEmail } from "@/lib/utils";

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Editor", label: "Editor" },
  { value: "Viewer", label: "Viewer" },
];

const ROLE_STYLES: Record<Role, string> = {
  Admin: "bg-ink text-white",
  Editor: "bg-blue-50 text-action ring-1 ring-inset ring-blue-100",
  Viewer: "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-200",
};

let nextId = 200;

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Editor");
  const [error, setError] = useState("");

  const active = members.filter((m) => m.status === "active");
  const pending = members.filter((m) => m.status === "pending");

  function invite() {
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setMembers((prev) => [
      ...prev,
      {
        id: `t${nextId++}`,
        name: email.split("@")[0],
        email,
        role,
        status: "pending",
      },
    ]);
    setEmail("");
  }

  function remove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Current plan
            </span>
            <h2 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
              Pro — {active.length} of 5 seats used
            </h2>
          </div>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-ink"
              style={{ width: `${(active.length / 5) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Invite
          </span>
          <h3 className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink">
            Add a teammate
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <Input
            label="Email"
            type="email"
            placeholder="teammate@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Select
            label="Role"
            options={ROLE_OPTIONS}
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="sm:w-40"
          />
          <Button onClick={invite}>
            <UserPlus className="h-4 w-4" /> Invite
          </Button>
        </div>
      </Card>

      <Card padded={false}>
        <h3 className="border-b border-neutral-100 px-6 py-4 text-sm font-semibold tracking-[-0.01em] text-ink">
          Team members
        </h3>
        <ul className="divide-y divide-neutral-100">
          {active.map((m) => (
            <MemberRow
              key={m.id}
              member={m}
              styles={ROLE_STYLES}
              onRemove={remove}
            />
          ))}
        </ul>
      </Card>

      {pending.length > 0 && (
        <Card padded={false}>
          <h3 className="border-b border-neutral-100 px-6 py-4 text-sm font-semibold tracking-[-0.01em] text-ink">
            Pending invites
          </h3>
          <ul className="divide-y divide-neutral-100">
            {pending.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-4 px-5 py-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-gray-500">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {m.email}
                  </p>
                  <p className="text-xs text-gray-500">Invitation pending</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => alert(`Invite resent to ${m.email}`)}>
                  Resend
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-error hover:bg-red-50"
                  onClick={() => remove(m.id)}
                >
                  Cancel
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function MemberRow({
  member,
  styles,
  onRemove,
}: {
  member: TeamMember;
  styles: Record<Role, string>;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="flex items-center gap-4 px-5 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-action text-sm font-semibold text-white">
        {member.name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{member.name}</p>
        <p className="truncate text-xs text-gray-500">{member.email}</p>
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[member.role]}`}
      >
        {member.role}
      </span>
      <button
        onClick={() => onRemove(member.id)}
        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-error"
        aria-label="Remove member"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
