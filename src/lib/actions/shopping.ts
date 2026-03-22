"use server";

import { db } from "@/lib/db";
import {
  mealSlots,
  meals,
  mealIngredients,
  ingredients,
  shoppingLists,
  shoppingListItems,
} from "@/lib/db/schema";
import { auth } from "../../../auth";
import { eq, and, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function generateShoppingList(weekStartDate: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 1. Get all non-skipped meal slots with meals for this week (both calendars)
  const slots = await db
    .select({
      mealId: mealSlots.mealId,
      mealName: meals.name,
    })
    .from(mealSlots)
    .innerJoin(meals, eq(mealSlots.mealId, meals.id))
    .where(
      and(
        eq(mealSlots.weekStartDate, weekStartDate),
        eq(mealSlots.isSkipped, false),
        isNotNull(mealSlots.mealId)
      )
    );

  // 2. Get ingredients for each meal and aggregate
  const ingredientMap = new Map<
    string,
    { ingredientId: string; name: string; meals: Set<string> }
  >();

  for (const slot of slots) {
    if (!slot.mealId) continue;

    const mealIngs = await db
      .select({
        ingredientId: ingredients.id,
        ingredientName: ingredients.name,
      })
      .from(mealIngredients)
      .innerJoin(
        ingredients,
        eq(mealIngredients.ingredientId, ingredients.id)
      )
      .where(eq(mealIngredients.mealId, slot.mealId));

    for (const ing of mealIngs) {
      const existing = ingredientMap.get(ing.ingredientId);
      if (existing) {
        existing.meals.add(slot.mealName!);
      } else {
        ingredientMap.set(ing.ingredientId, {
          ingredientId: ing.ingredientId,
          name: ing.ingredientName,
          meals: new Set([slot.mealName!]),
        });
      }
    }
  }

  // 3. Upsert shopping list
  const [existing] = await db
    .select()
    .from(shoppingLists)
    .where(eq(shoppingLists.weekStartDate, weekStartDate));

  let listId: string;
  if (existing) {
    listId = existing.id;
    await db
      .update(shoppingLists)
      .set({ updatedAt: new Date() })
      .where(eq(shoppingLists.id, listId));

    // Delete only ingredient-based items (preserve extras and essentials)
    await db
      .delete(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.shoppingListId, listId),
          eq(shoppingListItems.isExtraItem, false),
          eq(shoppingListItems.isEssential, false)
        )
      );
  } else {
    const [created] = await db
      .insert(shoppingLists)
      .values({ weekStartDate })
      .returning({ id: shoppingLists.id });
    listId = created.id;
  }

  // 4. Insert aggregated ingredient items
  for (const [, item] of ingredientMap) {
    await db.insert(shoppingListItems).values({
      shoppingListId: listId,
      ingredientId: item.ingredientId,
      itemName: item.name,
      mealAssociations: Array.from(item.meals),
      isAcquired: false,
      isExtraItem: false,
      isEssential: false,
    });
  }

  revalidatePath(`/shopping-list/${weekStartDate}`);
}

export async function toggleItemAcquired(
  itemId: string,
  isAcquired: boolean
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [item] = await db
    .update(shoppingListItems)
    .set({ isAcquired })
    .where(eq(shoppingListItems.id, itemId))
    .returning({ shoppingListId: shoppingListItems.shoppingListId });

  if (item) {
    const [list] = await db
      .select({ weekStartDate: shoppingLists.weekStartDate })
      .from(shoppingLists)
      .where(eq(shoppingLists.id, item.shoppingListId));

    if (list) {
      revalidatePath(`/shopping-list/${list.weekStartDate}`);
    }
  }
}

export async function addExtraItem(
  shoppingListId: string,
  itemName: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const trimmed = itemName.trim();
  if (!trimmed) throw new Error("Item name is required");

  await db.insert(shoppingListItems).values({
    shoppingListId,
    itemName: trimmed,
    isExtraItem: true,
    isAcquired: false,
    isEssential: false,
  });

  // Find the week start date for revalidation
  const [list] = await db
    .select({ weekStartDate: shoppingLists.weekStartDate })
    .from(shoppingLists)
    .where(eq(shoppingLists.id, shoppingListId));

  if (list) {
    revalidatePath(`/shopping-list/${list.weekStartDate}`);
  }
}

export async function removeExtraItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(shoppingListItems)
    .where(
      and(
        eq(shoppingListItems.id, itemId),
        eq(shoppingListItems.isExtraItem, true)
      )
    );
}

export async function toggleEssentialOnList(
  shoppingListId: string,
  essentialName: string,
  add: boolean
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (add) {
    await db.insert(shoppingListItems).values({
      shoppingListId,
      itemName: essentialName,
      isEssential: true,
      isExtraItem: false,
      isAcquired: false,
    });
  } else {
    // Find and remove the essential item
    const [item] = await db
      .select()
      .from(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.shoppingListId, shoppingListId),
          eq(shoppingListItems.itemName, essentialName),
          eq(shoppingListItems.isEssential, true)
        )
      );
    if (item) {
      await db
        .delete(shoppingListItems)
        .where(eq(shoppingListItems.id, item.id));
    }
  }

  const [list] = await db
    .select({ weekStartDate: shoppingLists.weekStartDate })
    .from(shoppingLists)
    .where(eq(shoppingLists.id, shoppingListId));

  if (list) {
    revalidatePath(`/shopping-list/${list.weekStartDate}`);
  }
}
