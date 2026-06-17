"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Command, LogOut, Menu, Search } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface NavBarProps {
  title: string;
  description?: string;
  onMenu: () => void;
}

interface UserInfo {
  name: string;
  email: string;
  avatarUrl: string | null;
}

export default function NavBar({ title, description, onMenu }: NavBarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<UserInfo>({
    name: "User",
    email: "",
    avatarUrl: null,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
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
        email: authUser.email || "",
        avatarUrl: linkedin?.profile_photo_url || profile?.avatar_url || null,
      });
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-[#FAFAF9]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenu}
            className="rounded-md p-2 text-neutral-600 transition-colors hover:bg-neutral-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-ink">
              {title}
            </h1>
            {description && (
              <p className="hidden truncate text-xs text-neutral-500 sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search posts, topics, people…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-48 md:w-64 lg:w-72 rounded-md border border-neutral-200 bg-white pl-9 pr-12 text-[13px] text-ink placeholder:text-neutral-400 transition-colors focus:border-neutral-400 focus:outline-none"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 lg:inline-flex">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-brand to-action text-xs font-semibold text-white ring-2 ring-transparent transition-shadow hover:ring-neutral-200"
              aria-label="Account menu"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.18)]">
                  <div className="border-b border-neutral-100 px-4 py-3">
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="truncate text-xs text-neutral-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-neutral-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-error transition-colors hover:bg-neutral-50"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
