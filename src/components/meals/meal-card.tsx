import Link from "next/link";

interface MealCardProps {
  meal: {
    id: string;
    name: string;
    createdBy: string | null;
    ingredients: { id: string; name: string }[];
  };
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Link
      href={`/meals/${meal.id}`}
      className="block rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 p-4 hover:border-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 hover:shadow-sm transition-all"
    >
      <h3 className="font-medium text-gray-900 dark:text-gray-100">{meal.name}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {meal.ingredients.length} ingredient
        {meal.ingredients.length !== 1 ? "s" : ""}
      </p>
      {meal.ingredients.length > 0 && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 truncate">
          {meal.ingredients.map((i) => i.name).join(", ")}
        </p>
      )}
    </Link>
  );
}
