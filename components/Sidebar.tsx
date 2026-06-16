"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Sparkles, X } from "lucide-react";
import Logo from "@/components/Common/Logo";
import Icon from "@/components/Common/Icon";
import { SIDEBAR_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface UserSummary {
  name: string;
  plan: string;
  avatarUrl: string | null;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSummary>({
    name: "User",
    plan: "Free",
    avatarUrl: null,
  });

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, subscription_plan, avatar_url")
        .eq("id", authUser.id)
        .single();

      const { data: linkedin } = await supabase
        .from("user_linkedin_accounts")
        .select("profile_name, profile_photo_url")
        .eq("user_id", authUser.id)
        .eq("is_active", true)
        .maybeSingle();

      setUser({
        name:
          profile?.full_name ||
          linkedin?.profile_name ||
          authUser.email?.split("@")[0] ||
          "User",
        plan: profile?.subscription_plan
          ? profile.subscription_plan.charAt(0).toUpperCase() +
            profile.subscription_plan.slice(1)
          : "Free",
        avatarUrl: linkedin?.profile_photo_url || profile?.avatar_url || null,
      });
    });
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-neutral-200/70 bg-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-200/70 px-5">
          <Logo href="/dashboard" />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Workspace
          </div>
          <div className="space-y-0.5">
            {SIDEBAR_NAV.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-neutral-100 text-ink"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-ink",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-ink" />
                  )}
                  <Icon
                    name={item.icon}
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      active ? "text-ink" : "text-neutral-500",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Upgrade card */}
        <div className="border-t border-neutral-200/70 p-3">
          <Link
            href="/dashboard/settings"
            className="block rounded-lg border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-3 transition-all hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-white">
                <Sparkles className="h-3 w-3" />
              </span>
              <span className="text-xs font-semibold text-ink">
                Upgrade to Pro
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">
              Unlimited generation + full analytics suite.
            </p>
          </Link>
        </div>

        {/* User */}
        <div className="border-t border-neutral-200/70 p-3">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 rounded-md p-1.5 transition-colors hover:bg-neutral-50"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-action text-xs font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-neutral-500">
                {user.plan} plan
              </p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          </Link>
        </div>
      </aside>
    </>
  );
}
