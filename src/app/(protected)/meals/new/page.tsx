import Link from "next/link";
import { MealForm } from "@/components/meals/meal-form";

export default function NewMealPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/meals" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          &larr; Back to meals
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">New meal</h1>
      </div>
      <MealForm />
    </div>
  );
}
