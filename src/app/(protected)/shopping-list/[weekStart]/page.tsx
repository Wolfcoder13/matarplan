import Link from "next/link";
import { getShoppingList, getAllEssentials } from "@/lib/queries/shopping";
import { generateShoppingList } from "@/lib/actions/shopping";
import { ShoppingListView } from "@/components/shopping/shopping-list-view";
import { formatDateRange } from "@/lib/utils/dates";

export default async function ShoppingListPage({
  params,
}: {
  params: Promise<{ weekStart: string }>;
}) {
  const { weekStart } = await params;
  const list = await getShoppingList(weekStart);
  const essentials = await getAllEssentials();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Shopping List</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateRange(weekStart)}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/plan/${weekStart}`}
            className="rounded-lg border border-gray-300 dark:border-gray-500 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            View plan
          </Link>
          <form action={generateShoppingList.bind(null, weekStart)}>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {list ? "Regenerate" : "Generate"}
            </button>
          </form>
        </div>
      </div>

      {list ? (
        <ShoppingListView
          listId={list.id}
          items={list.items}
          essentials={essentials}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            No shopping list generated yet for this week.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            Fill in your meal plan first, then generate the shopping list.
          </p>
        </div>
      )}
    </div>
  );
}
