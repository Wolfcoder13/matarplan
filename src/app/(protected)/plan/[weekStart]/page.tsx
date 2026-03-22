import { redirect } from "next/navigation";
import Link from "next/link";
import { getWeekPlan } from "@/lib/queries/planning";
import { WeekNavigator } from "@/components/planning/week-navigator";
import { WeekGrid } from "@/components/planning/week-grid";
import { isPastWeek, getCurrentWeekStart } from "@/lib/utils/dates";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ weekStart: string }>;
}) {
  const { weekStart } = await params;

  // Validate the weekStart format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
    redirect(`/plan/${getCurrentWeekStart()}`);
  }

  const plan = await getWeekPlan(weekStart);
  const pastWeek = isPastWeek(weekStart);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Plan Week</h1>
        <Link
          href={`/shopping-list/${weekStart}`}
          className="rounded-lg border border-gray-300 dark:border-gray-500 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Shopping list
        </Link>
      </div>

      {pastWeek && (
        <div className="mb-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200">
          This is a past week. Slots are read-only.
        </div>
      )}

      <WeekNavigator weekStart={weekStart} />
      <WeekGrid weekStart={weekStart} plan={plan} readOnly={pastWeek} />
    </div>
  );
}
