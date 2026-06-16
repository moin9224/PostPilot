"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarProps {
  posts: Post[];
  onSelectPost?: (post: Post) => void;
  onSelectDay?: (date: Date) => void;
}

export default function Calendar({
  posts,
  onSelectPost,
  onSelectDay,
}: CalendarProps) {
  // Anchor on June 2026 so the mock data lands on visible days.
  const [cursor, setCursor] = useState(new Date(2026, 5, 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(2026, 5, 15);

  // Build a 6-row grid of cells (null for padding).
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function postsFor(day: number) {
    return posts.filter((p) => {
      const ref = p.scheduledFor ?? p.createdAt;
      const date = new Date(ref);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  }

  return (
    <div className="rounded-lg border border-edge bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-edge px-4 py-3">
        <h3 className="font-semibold text-ink">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-md p-1.5 text-gray-500 hover:bg-mist"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCursor(new Date(2026, 5, 1))}
            className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-mist"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-md p-1.5 text-gray-500 hover:bg-mist"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-edge bg-mist/50 text-center text-xs font-medium text-gray-500">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const dayPosts = day ? postsFor(day) : [];
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          return (
            <div
              key={i}
              onClick={() => day && onSelectDay?.(new Date(year, month, day))}
              className={cn(
                "min-h-[96px] border-b border-r border-edge p-1.5 last:border-r-0",
                !day && "bg-mist/30",
                !!day && "cursor-pointer hover:bg-mist/40",
              )}
            >
              {day && (
                <>
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday
                        ? "bg-brand font-semibold text-white"
                        : "text-gray-600",
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayPosts.slice(0, 3).map((p) => (
                      <PostCard
                        key={p.id}
                        post={p}
                        onClick={() => onSelectPost?.(p)}
                      />
                    ))}
                    {dayPosts.length > 3 && (
                      <p className="px-1.5 text-[10px] text-gray-400">
                        +{dayPosts.length - 3} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
