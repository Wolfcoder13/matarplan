"use server";

import { db } from "@/lib/db";
import { meals, ingredients, mealIngredients } from "@/lib/db/schema";
import { auth } from "../../../auth";
import { eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getOrCreateIngredient(name: string): Promise<string> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Ingredient name cannot be empty");
  const normalized = trimmed.toLowerCase();

  const [existing] = await db
    .select()
    .from(ingredients)
    .where(ilike(ingredients.name, normalized));

  if (existing) return existing.id;

  const [created] = await db
    .insert(ingredients)
    .values({ name: normalized })
    .returning({ id: ingredients.id });

  return created.id;
}

export async function createMeal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Meal name is required");

  const recipe = (formData.get("recipe") as string)?.trim() || null;
  const ingredientNames = formData.getAll("ingredients") as string[];
  const validIngredients = ingredientNames.filter((n) => n.trim());

  const [meal] = await db
    .insert(meals)
    .values({ name, recipe, createdBy: session.user.id })
    .returning({ id: meals.id });

  for (const ingredientName of validIngredients) {
    const ingredientId = await getOrCreateIngredient(ingredientName);
    await db
      .insert(mealIngredients)
      .values({ mealId: meal.id, ingredientId })
      .onConflictDoNothing();
  }

  revalidatePath("/meals");
  redirect("/meals");
}

export async function createMealAndReturn(
  name: string,
  ingredientNames: string[],
  recipe?: string
): Promise<{ id: string; name: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Meal name is required");

  const trimmedRecipe = recipe?.trim() || null;
  const validIngredients = ingredientNames.filter((n) => n.trim());

  const [meal] = await db
    .insert(meals)
    .values({ name: trimmedName, recipe: trimmedRecipe, createdBy: session.user.id })
    .returning({ id: meals.id });

  for (const ingredientName of validIngredients) {
    const ingredientId = await getOrCreateIngredient(ingredientName);
    await db
      .insert(mealIngredients)
      .values({ mealId: meal.id, ingredientId })
      .onConflictDoNothing();
  }

  revalidatePath("/meals");
  return { id: meal.id, name: trimmedName };
}

export async function updateMeal(mealId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Meal name is required");

  const recipe = (formData.get("recipe") as string)?.trim() || null;
  const ingredientNames = formData.getAll("ingredients") as string[];
  const validIngredients = ingredientNames.filter((n) => n.trim());

  await db
    .update(meals)
    .set({ name, recipe, updatedAt: new Date() })
    .where(eq(meals.id, mealId));

  // Remove existing ingredients and re-add
  await db.delete(mealIngredients).where(eq(mealIngredients.mealId, mealId));

  for (const ingredientName of validIngredients) {
    const ingredientId = await getOrCreateIngredient(ingredientName);
    await db
      .insert(mealIngredients)
      .values({ mealId, ingredientId })
      .onConflictDoNothing();
  }

  revalidatePath("/meals");
  redirect(`/meals/${mealId}`);
}

export async function deleteMeal(mealId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(meals).where(eq(meals.id, mealId));

  revalidatePath("/meals");
  redirect("/meals");
}
