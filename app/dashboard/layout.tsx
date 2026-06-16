"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import { SIDEBAR_NAV } from "@/lib/constants";

function navMatch(pathname: string) {
  return [...SIDEBAR_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/dashboard"
        ? pathname === item.href
        : pathname.startsWith(item.href),
    );
}

const DESCRIPTIONS: Record<string, string> = {
  "/dashboard": "Your week at a glance.",
  "/dashboard/content-generator": "Draft posts in your voice. Pick the winner.",
  "/dashboard/calendar": "Queue posts for peak attention windows.",
  "/dashboard/analytics": "Reach, engagement and follower flow.",

  "/dashboard/content-library": "Every draft, scheduled and published post.",
  "/dashboard/team": "Roles, approvals and shared access.",
  "/dashboard/settings": "Account, brand voice and integrations.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const match = navMatch(pathname);
  const title = match?.label ?? "Dashboard";
  const description = DESCRIPTIONS[match?.href ?? "/dashboard"] ?? "";

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-ink antialiased">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <NavBar
          title={title}
          description={description}
          onMenu={() => setSidebarOpen(true)}
        />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
