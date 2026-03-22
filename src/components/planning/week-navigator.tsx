"use client";

import Link from "next/link";
import {
  formatDateRange,
  getPreviousWeekStartFrom,
  getNextWeekStartFrom,
  isCurrentWeek,
  getCurrentWeekStart,
} from "@/lib/utils/dates";

interface WeekNavigatorProps {
  weekStart: string;
  basePath?: string;
}

export function WeekNavigator({
  weekStart,
  basePath = "/plan",
}: WeekNavigatorProps) {
  const prev = getPreviousWeekStartFrom(weekStart);
  const next = getNextWeekStartFrom(weekStart);
  const current = isCurrentWeek(weekStart);

  return (
    <div className="flex items-center justify-between mb-4">
      <Link
        href={`${basePath}/${prev}`}
        className="rounded-lg border border-gray-300 dark:border-gray-500 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        &larr; Prev
      </Link>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {formatDateRange(weekStart)}
        </p>
        {current && (
          <p className="text-xs text-blue-600 dark:text-blue-400">Current week</p>
        )}
      </div>
      <Link
        href={`${basePath}/${next}`}
        className="rounded-lg border border-gray-300 dark:border-gray-500 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Next &rarr;
      </Link>
    </div>
  );
}
