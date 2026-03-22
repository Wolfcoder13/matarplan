"use client";

import { useOptimistic, useTransition } from "react";
import { toggleItemAcquired } from "@/lib/actions/shopping";

interface ShoppingItemProps {
  id: string;
  itemName: string;
  mealAssociations: string[] | null;
  isAcquired: boolean;
  isExtraItem: boolean;
  isEssential: boolean;
  onRemove?: () => void;
}

export function ShoppingItem({
  id,
  itemName,
  mealAssociations,
  isAcquired,
  isExtraItem,
  onRemove,
}: ShoppingItemProps) {
  const [optimisticAcquired, setOptimisticAcquired] =
    useOptimistic(isAcquired);
  const [, startTransition] = useTransition();

  function handleToggle() {
    const newValue = !optimisticAcquired;
    startTransition(async () => {
      setOptimisticAcquired(newValue);
      await toggleItemAcquired(id, newValue);
    });
  }

  return (
    <div
      onClick={handleToggle}
      className={`flex items-center gap-3 px-4 py-3 min-h-[56px] cursor-pointer select-none transition-colors active:bg-gray-100 dark:active:bg-gray-700 ${
        optimisticAcquired ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"
      }`}
    >
      <div
        className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
          optimisticAcquired
            ? "bg-green-500 border-green-500"
            : "border-gray-300 dark:border-gray-600"
        }`}
      >
        {optimisticAcquired && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            optimisticAcquired
              ? "line-through text-gray-400 dark:text-gray-500"
              : "text-gray-900 dark:text-gray-100 font-medium"
          }`}
        >
          {itemName}
        </p>
        {mealAssociations && mealAssociations.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {mealAssociations.join(", ")}
          </p>
        )}
      </div>
      {isExtraItem && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="shrink-0 text-gray-400 dark:text-gray-500 hover:text-red-500 p-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
