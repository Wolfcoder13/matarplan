import Link from "next/link";
import { getWeekPlan } from "@/lib/queries/planning";
import { WeekNavigator } from "@/components/planning/week-navigator";
import { WeekGrid } from "@/components/planning/week-grid";
import {
  getCurrentWeekStart,
  getNextWeekStart,
  formatDateRange,
} from "@/lib/utils/dates";

export default async function HomePage() {
  const currentWeek = getCurrentWeekStart();
  const nextWeek = getNextWeekStart();
  const plan = await getWeekPlan(currentWeek);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">This Week</h1>
        <div className="flex gap-2">
          <Link
            href={`/plan/${currentWeek}`}
            className="rounded-lg border border-gray-300 dark:border-gray-500 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Edit plan
          </Link>
          <Link
            href={`/shopping-list/${currentWeek}`}
            className="rounded-lg border border-gray-300 dark:border-gray-500 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Shopping list
          </Link>
        </div>
      </div>

      <WeekNavigator weekStart={currentWeek} basePath="/plan" />
      <WeekGrid weekStart={currentWeek} plan={plan} readOnly />

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Plan next week
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDateRange(nextWeek)}
            </p>
          </div>
          <Link
            href={`/plan/${nextWeek}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Plan week
          </Link>
        </div>
      </div>
    </div>
  );
}
