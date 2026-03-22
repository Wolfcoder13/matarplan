import { db } from "@/lib/db";
import { meals, ingredients, mealIngredients, users } from "@/lib/db/schema";
import { eq, ilike, desc } from "drizzle-orm";

export async function getAllMeals() {
  const allMeals = await db
    .select({
      id: meals.id,
      name: meals.name,
      createdBy: users.name,
      createdAt: meals.createdAt,
    })
    .from(meals)
    .leftJoin(users, eq(meals.createdBy, users.id))
    .orderBy(desc(meals.updatedAt));

  const mealsWithIngredients = await Promise.all(
    allMeals.map(async (meal) => {
      const mealIngs = await db
        .select({ id: ingredients.id, name: ingredients.name })
        .from(mealIngredients)
        .innerJoin(ingredients, eq(mealIngredients.ingredientId, ingredients.id))
        .where(eq(mealIngredients.mealId, meal.id));

      return { ...meal, ingredients: mealIngs };
    })
  );

  return mealsWithIngredients;
}

export async function getMealById(id: string) {
  const [meal] = await db
    .select({
      id: meals.id,
      name: meals.name,
      createdBy: users.name,
      createdAt: meals.createdAt,
    })
    .from(meals)
    .leftJoin(users, eq(meals.createdBy, users.id))
    .where(eq(meals.id, id));

  if (!meal) return null;

  const mealIngs = await db
    .select({ id: ingredients.id, name: ingredients.name })
    .from(mealIngredients)
    .innerJoin(ingredients, eq(mealIngredients.ingredientId, ingredients.id))
    .where(eq(mealIngredients.mealId, id));

  return { ...meal, ingredients: mealIngs };
}

export async function searchMeals(query: string) {
  if (!query.trim()) {
    return db
      .select({ id: meals.id, name: meals.name })
      .from(meals)
      .orderBy(meals.name)
      .limit(50);
  }

  return db
    .select({ id: meals.id, name: meals.name })
    .from(meals)
    .where(ilike(meals.name, `%${query.trim()}%`))
    .limit(10);
}

export async function searchIngredients(query: string) {
  if (!query.trim()) return [];

  return db
    .select({ id: ingredients.id, name: ingredients.name })
    .from(ingredients)
    .where(ilike(ingredients.name, `%${query.trim()}%`))
    .limit(10);
}
