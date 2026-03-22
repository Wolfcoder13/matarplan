import { db } from "@/lib/db";
import { mealSlots, meals } from "@/lib/db/schema";
import { eq, lt, desc, isNotNull, sql } from "drizzle-orm";
import { getCurrentWeekStart } from "@/lib/utils/dates";

export async function getPastWeeks(limit = 12) {
  const currentWeek = getCurrentWeekStart();

  const weeks = await db
    .selectDistinct({ weekStartDate: mealSlots.weekStartDate })
    .from(mealSlots)
    .where(lt(mealSlots.weekStartDate, currentWeek))
    .orderBy(desc(mealSlots.weekStartDate))
    .limit(limit);

  const result = await Promise.all(
    weeks.map(async (week) => {
      const slots = await db
        .select({
          mealName: meals.name,
          isSkipped: mealSlots.isSkipped,
          mealId: mealSlots.mealId,
        })
        .from(mealSlots)
        .leftJoin(meals, eq(mealSlots.mealId, meals.id))
        .where(eq(mealSlots.weekStartDate, week.weekStartDate));

      const filled = slots.filter((s) => s.mealId !== null).length;
      const skipped = slots.filter((s) => s.isSkipped).length;
      const mealNames = [
        ...new Set(
          slots
            .filter((s) => s.mealName)
            .map((s) => s.mealName!)
        ),
      ].slice(0, 5);

      return {
        weekStartDate: week.weekStartDate,
        filled,
        skipped,
        mealNames,
      };
    })
  );

  return result;
}
