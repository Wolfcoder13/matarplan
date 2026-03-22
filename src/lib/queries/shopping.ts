import { db } from "@/lib/db";
import {
  shoppingLists,
  shoppingListItems,
  householdEssentials,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type ShoppingItem = {
  id: string;
  itemName: string;
  mealAssociations: string[] | null;
  isAcquired: boolean;
  isExtraItem: boolean;
  isEssential: boolean;
};

export async function getShoppingList(weekStartDate: string) {
  const [list] = await db
    .select()
    .from(shoppingLists)
    .where(eq(shoppingLists.weekStartDate, weekStartDate));

  if (!list) return null;

  const items = await db
    .select({
      id: shoppingListItems.id,
      itemName: shoppingListItems.itemName,
      mealAssociations: shoppingListItems.mealAssociations,
      isAcquired: shoppingListItems.isAcquired,
      isExtraItem: shoppingListItems.isExtraItem,
      isEssential: shoppingListItems.isEssential,
    })
    .from(shoppingListItems)
    .where(eq(shoppingListItems.shoppingListId, list.id));

  return {
    id: list.id,
    weekStartDate: list.weekStartDate,
    items,
  };
}

export async function getAllEssentials() {
  return db
    .select({ id: householdEssentials.id, name: householdEssentials.name })
    .from(householdEssentials)
    .orderBy(householdEssentials.name);
}
