import { db } from "@/lib/db";
import { mealSlots, meals } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { DayOfWeek } from "@/lib/utils/dates";

export type SlotData = {
  id: string;
  calendarType: "adults" | "daughter";
  dayOfWeek: DayOfWeek;
  slotType: "lunch" | "dinner";
  mealId: string | null;
  mealName: string | null;
  isSkipped: boolean;
  skipNote: string | null;
};

export type WeekPlan = Record<
  "adults" | "daughter",
  Record<DayOfWeek, { lunch: SlotData | null; dinner: SlotData | null }>
>;

export async function getWeekPlan(weekStartDate: string): Promise<WeekPlan> {
  const slots = await db
    .select({
      id: mealSlots.id,
      calendarType: mealSlots.calendarType,
      dayOfWeek: mealSlots.dayOfWeek,
      slotType: mealSlots.slotType,
      mealId: mealSlots.mealId,
      mealName: meals.name,
      isSkipped: mealSlots.isSkipped,
      skipNote: mealSlots.skipNote,
    })
    .from(mealSlots)
    .leftJoin(meals, eq(mealSlots.mealId, meals.id))
    .where(eq(mealSlots.weekStartDate, weekStartDate));

  const days: DayOfWeek[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const plan: WeekPlan = {
    adults: {} as WeekPlan["adults"],
    daughter: {} as WeekPlan["daughter"],
  };

  for (const day of days) {
    plan.adults[day] = { lunch: null, dinner: null };
    plan.daughter[day] = { lunch: null, dinner: null };
  }

  for (const slot of slots) {
    const cal = slot.calendarType as "adults" | "daughter";
    const day = slot.dayOfWeek as DayOfWeek;
    const slotType = slot.slotType as "lunch" | "dinner";
    plan[cal][day][slotType] = slot as SlotData;
  }

  return plan;
}

export async function getWeekSlotCount(weekStartDate: string) {
  const slots = await db
    .select({ id: mealSlots.id, isSkipped: mealSlots.isSkipped, mealId: mealSlots.mealId })
    .from(mealSlots)
    .where(eq(mealSlots.weekStartDate, weekStartDate));

  const filled = slots.filter((s) => s.mealId !== null).length;
  const skipped = slots.filter((s) => s.isSkipped).length;
  return { filled, skipped, total: slots.length };
}
