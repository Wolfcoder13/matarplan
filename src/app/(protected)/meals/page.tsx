import Link from "next/link";
import { getAllMeals } from "@/lib/queries/meals";
import { MealCard } from "@/components/meals/meal-card";

export default async function MealsPage() {
  const meals = await getAllMeals();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Meals</h1>
        <Link
          href="/meals/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New meal
        </Link>
      </div>

      {meals.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No meals yet. Create your first meal to get started.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}
