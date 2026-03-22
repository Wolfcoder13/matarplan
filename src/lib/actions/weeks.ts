"use server";

import { db } from "@/lib/db";
import { mealSlots } from "@/lib/db/schema";
import { auth } from "../../../auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function copyWeekPlan(
  sourceWeekStart: string,
  targetWeekStart: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Get all slots from source week
  const sourceSlots = await db
    .select()
    .from(mealSlots)
    .where(eq(mealSlots.weekStartDate, sourceWeekStart));

  if (sourceSlots.length === 0) {
    throw new Error("Source week has no planned meals");
  }

  // Copy each slot to target week
  for (const slot of sourceSlots) {
    // Check if slot already exists in target
    const [existing] = await db
      .select()
      .from(mealSlots)
      .where(
        and(
          eq(mealSlots.calendarType, slot.calendarType),
          eq(mealSlots.weekStartDate, targetWeekStart),
          eq(mealSlots.dayOfWeek, slot.dayOfWeek),
          eq(mealSlots.slotType, slot.slotType)
        )
      );

    if (existing) {
      await db
        .update(mealSlots)
        .set({
          mealId: slot.mealId,
          isSkipped: slot.isSkipped,
          skipNote: slot.skipNote,
          updatedAt: new Date(),
        })
        .where(eq(mealSlots.id, existing.id));
    } else {
      await db.insert(mealSlots).values({
        calendarType: slot.calendarType,
        weekStartDate: targetWeekStart,
        dayOfWeek: slot.dayOfWeek,
        slotType: slot.slotType,
        mealId: slot.mealId,
        isSkipped: slot.isSkipped,
        skipNote: slot.skipNote,
      });
    }
  }

  revalidatePath(`/plan/${targetWeekStart}`);
  redirect(`/plan/${targetWeekStart}`);
}
