"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, Command, LogOut, Menu, Search } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock";

interface NavBarProps {
  title: string;
  description?: string;
  onMenu: () => void;
}

export default function NavBar({ title, description, onMenu }: NavBarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
              className="h-9 w-72 rounded-md border border-neutral-200 bg-white pl-9 pr-12 text-[13px] text-ink placeholder:text-neutral-400 transition-colors focus:border-neutral-400 focus:outline-none"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 lg:inline-flex">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>

          <button
            className="relative rounded-md p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
            aria-label="Notifications"
            onClick={() => alert("No new notifications")}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-error" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-action text-xs font-semibold text-white ring-2 ring-transparent transition-shadow hover:ring-neutral-200"
              aria-label="Account menu"
            >
              {CURRENT_USER.name.charAt(0)}
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
                    <p className="text-sm font-medium text-ink">
                      {CURRENT_USER.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {CURRENT_USER.email}
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
                    <Link
                      href="/dashboard/team"
                      className="block px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Team
                    </Link>
                  </div>
                  <div className="border-t border-neutral-100 py-1">
                    <button
                      onClick={() => router.push("/auth/login")}
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
