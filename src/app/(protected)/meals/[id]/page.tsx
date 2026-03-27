import Link from "next/link";
import { notFound } from "next/navigation";
import { getMealById } from "@/lib/queries/meals";
import { deleteMeal } from "@/lib/actions/meals";

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meal = await getMealById(id);

  if (!meal) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/meals"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          &larr; Back to meals
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{meal.name}</h1>
          {meal.createdBy && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Created by {meal.createdBy}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/meals/${meal.id}/edit`}
            className="rounded-lg border border-gray-300 dark:border-gray-500 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Edit
          </Link>
          <form action={deleteMeal.bind(null, meal.id)}>
            <button
              type="submit"
              className="rounded-lg border border-red-300 dark:border-red-800 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Ingredients</h2>
        {meal.ingredients.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No ingredients added.</p>
        ) : (
          <ul className="space-y-1">
            {meal.ingredients.map((ing) => (
              <li
                key={ing.id}
                className="text-sm text-gray-600 dark:text-gray-200 py-1 px-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                {ing.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Recipe</h2>
        {meal.recipe ? (
          <p className="text-sm text-gray-600 dark:text-gray-200 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded p-3">
            {meal.recipe}
          </p>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No recipe added.</p>
        )}
      </div>
    </div>
  );
}
