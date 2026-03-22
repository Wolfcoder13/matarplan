import Link from "next/link";
import { notFound } from "next/navigation";
import { getMealById } from "@/lib/queries/meals";
import { MealForm } from "@/components/meals/meal-form";

export default async function EditMealPage({
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
          href={`/meals/${meal.id}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          &larr; Back to meal
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
          Edit {meal.name}
        </h1>
      </div>
      <MealForm meal={meal} />
    </div>
  );
}
