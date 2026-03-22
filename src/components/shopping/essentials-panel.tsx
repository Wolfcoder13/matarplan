"use client";

import { toggleEssentialOnList } from "@/lib/actions/shopping";

interface EssentialsPanelProps {
  shoppingListId: string;
  essentials: { id: string; name: string }[];
  activeEssentials: string[]; // names of essentials already on the list
}

export function EssentialsPanel({
  shoppingListId,
  essentials,
  activeEssentials,
}: EssentialsPanelProps) {
  if (essentials.length === 0) {
    return (
      <div className="px-4 py-3">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          No household essentials configured.{" "}
          <a href="/essentials" className="text-blue-600 dark:text-blue-400 hover:underline">
            Add some
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {essentials.map((essential) => {
          const isActive = activeEssentials.includes(essential.name);
          return (
            <button
              key={essential.id}
              onClick={() =>
                toggleEssentialOnList(
                  shoppingListId,
                  essential.name,
                  !isActive
                )
              }
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {isActive ? "- " : "+ "}
              {essential.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
