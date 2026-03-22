import { getAllEssentials } from "@/lib/queries/shopping";
import { addEssential, removeEssential } from "@/lib/actions/essentials";

export default async function EssentialsPage() {
  const essentials = await getAllEssentials();

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Household Essentials
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Manage common items you frequently need. These can be quickly added to
        any shopping list.
      </p>

      {/* Add new essential */}
      <form
        action={async (formData: FormData) => {
          "use server";
          const name = formData.get("name") as string;
          if (name?.trim()) {
            await addEssential(name);
          }
        }}
        className="flex gap-2 mb-6"
      >
        <input
          name="name"
          type="text"
          placeholder="Add a household essential..."
          required
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {/* List */}
      {essentials.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No essentials added yet.</p>
      ) : (
        <ul className="space-y-2">
          {essentials.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3"
            >
              <span className="text-sm text-gray-700 dark:text-gray-200">{e.name}</span>
              <form action={removeEssential.bind(null, e.id)}>
                <button
                  type="submit"
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
