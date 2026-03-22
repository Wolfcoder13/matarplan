"use server";

import { db } from "@/lib/db";
import { householdEssentials } from "@/lib/db/schema";
import { auth } from "../../../auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addEssential(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name is required");

  await db
    .insert(householdEssentials)
    .values({ name: trimmed })
    .onConflictDoNothing();

  revalidatePath("/essentials");
}

export async function removeEssential(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(householdEssentials)
    .where(eq(householdEssentials.id, id));

  revalidatePath("/essentials");
}
