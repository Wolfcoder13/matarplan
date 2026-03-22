"use client";

import { useState } from "react";
import { addExtraItem } from "@/lib/actions/shopping";

interface ExtraItemInputProps {
  shoppingListId: string;
}

export function ExtraItemInput({ shoppingListId }: ExtraItemInputProps) {
  const [value, setValue] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    await addExtraItem(shoppingListId, value);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add extra item..."
        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Add
      </button>
    </form>
  );
}
