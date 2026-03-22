import Link from "next/link";
import { getPastWeeks } from "@/lib/queries/weeks";
import { copyWeekPlan } from "@/lib/actions/weeks";
import { formatDateRange, getNextWeekStart } from "@/lib/utils/dates";

export default async function WeeksPage() {
  const weeks = await getPastWeeks();
  const nextWeek = getNextWeekStart();

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Previous Weeks</h1>

      {weeks.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No previous weeks with planned meals yet.
        </p>
      ) : (
        <div className="space-y-3">
          {weeks.map((week) => (
            <div
              key={week.weekStartDate}
              className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDateRange(week.weekStartDate)}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {week.filled} meal{week.filled !== 1 ? "s" : ""} planned
                    {week.skipped > 0 &&
                      `, ${week.skipped} skipped`}
                  </p>
                  {week.mealNames.length > 0 && (
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 truncate max-w-xs">
                      {week.mealNames.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/plan/${week.weekStartDate}`}
                    className="rounded-lg border border-gray-300 dark:border-gray-500 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    View
                  </Link>
                  <form
                    action={copyWeekPlan.bind(
                      null,
                      week.weekStartDate,
                      nextWeek
                    )}
                  >
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Copy to next week
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
