"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MealDetails {
  id: string;
  name: string;
  recipe: string | null;
  ingredients: { id: string; name: string }[];
}

interface RecipeModalProps {
  mealId: string;
  onClose: () => void;
}

export function RecipeModal({ mealId, onClose }: RecipeModalProps) {
  const [meal, setMeal] = useState<MealDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeal() {
      try {
        const res = await fetch(`/api/meals/${mealId}`);
        if (res.ok) {
          const data = await res.json();
          setMeal(data.meal);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchMeal();
  }, [mealId]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-xl sm:rounded-xl p-4 pb-20 sm:pb-4 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {loading ? "Loading..." : meal?.name || "Meal not found"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none p-1"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            Loading meal details...
          </div>
        ) : meal ? (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Ingredients
              </h4>
              {meal.ingredients.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No ingredients added.
                </p>
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

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Recipe
              </h4>
              {meal.recipe ? (
                <p className="text-sm text-gray-600 dark:text-gray-200 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded p-3">
                  {meal.recipe}
                </p>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No recipe added.
                </p>
              )}
            </div>

            <Link
              href={`/meals/${meal.id}/edit`}
              className="block text-center rounded-lg border border-gray-300 dark:border-gray-500 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Edit meal
            </Link>
          </>
        ) : (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
            Could not load meal details.
          </div>
        )}
      </div>
    </div>
  );
}
