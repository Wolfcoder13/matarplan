"use server";

import { db } from "@/lib/db";
import { mealSlots } from "@/lib/db/schema";
import { auth } from "../../../auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type SlotIdentifier = {
  calendarType: "adults" | "daughter";
  weekStartDate: string;
  dayOfWeek: string;
  slotType: "lunch" | "dinner";
};

async function findSlot(slot: SlotIdentifier) {
  const [existing] = await db
    .select()
    .from(mealSlots)
    .where(
      and(
        eq(mealSlots.calendarType, slot.calendarType),
        eq(mealSlots.weekStartDate, slot.weekStartDate),
        eq(mealSlots.dayOfWeek, slot.dayOfWeek as any),
        eq(mealSlots.slotType, slot.slotType)
      )
    );
  return existing;
}

export async function assignMealToSlot(
  slot: SlotIdentifier & { mealId: string }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await findSlot(slot);

  if (existing) {
    await db
      .update(mealSlots)
      .set({
        mealId: slot.mealId,
        isSkipped: false,
        skipNote: null,
        updatedAt: new Date(),
      })
      .where(eq(mealSlots.id, existing.id));
  } else {
    await db.insert(mealSlots).values({
      calendarType: slot.calendarType,
      weekStartDate: slot.weekStartDate,
      dayOfWeek: slot.dayOfWeek as any,
      slotType: slot.slotType,
      mealId: slot.mealId,
      isSkipped: false,
    });
  }

  revalidatePath(`/plan/${slot.weekStartDate}`);
  revalidatePath("/");
}

export async function skipSlot(
  slot: SlotIdentifier & { skipNote?: string }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await findSlot(slot);

  if (existing) {
    await db
      .update(mealSlots)
      .set({
        mealId: null,
        isSkipped: true,
        skipNote: slot.skipNote || null,
        updatedAt: new Date(),
      })
      .where(eq(mealSlots.id, existing.id));
  } else {
    await db.insert(mealSlots).values({
      calendarType: slot.calendarType,
      weekStartDate: slot.weekStartDate,
      dayOfWeek: slot.dayOfWeek as any,
      slotType: slot.slotType,
      mealId: null,
      isSkipped: true,
      skipNote: slot.skipNote || null,
    });
  }

  revalidatePath(`/plan/${slot.weekStartDate}`);
  revalidatePath("/");
}

export async function clearSlot(slot: SlotIdentifier) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await findSlot(slot);
  if (existing) {
    await db.delete(mealSlots).where(eq(mealSlots.id, existing.id));
  }

  revalidatePath(`/plan/${slot.weekStartDate}`);
  revalidatePath("/");
}
