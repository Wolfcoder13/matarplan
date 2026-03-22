"use client";

import { ShoppingItem } from "./shopping-item";
import { ExtraItemInput } from "./extra-item-input";
import { EssentialsPanel } from "./essentials-panel";
import { removeExtraItem } from "@/lib/actions/shopping";
import type { ShoppingItem as ShoppingItemType } from "@/lib/queries/shopping";

interface ShoppingListViewProps {
  listId: string;
  items: ShoppingItemType[];
  essentials: { id: string; name: string }[];
}

export function ShoppingListView({
  listId,
  items,
  essentials,
}: ShoppingListViewProps) {
  const ingredientItems = items.filter(
    (i) => !i.isExtraItem && !i.isEssential
  );
  const extraItems = items.filter((i) => i.isExtraItem);
  const essentialItems = items.filter((i) => i.isEssential);
  const activeEssentialNames = essentialItems.map((i) => i.itemName);

  const totalItems = items.length;
  const acquiredItems = items.filter((i) => i.isAcquired).length;

  // Sort: unacquired first, then acquired
  const sortItems = (a: ShoppingItemType, b: ShoppingItemType) => {
    if (a.isAcquired === b.isAcquired) return 0;
    return a.isAcquired ? 1 : -1;
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-200">
          {acquiredItems} of {totalItems} items acquired
        </p>
        <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{
              width: totalItems > 0 ? `${(acquiredItems / totalItems) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      {/* Meal ingredients */}
      {ingredientItems.length > 0 && (
        <div>
          <h3 className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            From meals
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {[...ingredientItems].sort(sortItems).map((item) => (
              <ShoppingItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Extra items */}
      <div>
        <h3 className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
          Extra items
        </h3>
        {extraItems.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-2">
            {[...extraItems].sort(sortItems).map((item) => (
              <ShoppingItem
                key={item.id}
                {...item}
                onRemove={() => removeExtraItem(item.id)}
              />
            ))}
          </div>
        )}
        <ExtraItemInput shoppingListId={listId} />
      </div>

      {/* Essentials */}
      <div>
        <h3 className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
          Household essentials
        </h3>
        {essentialItems.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-2">
            {[...essentialItems].sort(sortItems).map((item) => (
              <ShoppingItem key={item.id} {...item} />
            ))}
          </div>
        )}
        <EssentialsPanel
          shoppingListId={listId}
          essentials={essentials}
          activeEssentials={activeEssentialNames}
        />
      </div>
    </div>
  );
}
