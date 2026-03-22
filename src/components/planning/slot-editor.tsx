"use client";

import { useState, useEffect, useRef } from "react";
import { assignMealToSlot, skipSlot, clearSlot } from "@/lib/actions/planning";

interface SlotEditorProps {
  calendarType: "adults" | "daughter";
  weekStartDate: string;
  dayOfWeek: string;
  slotType: "lunch" | "dinner";
  currentMealName: string | null;
  isSkipped: boolean;
  skipNote: string | null;
  onClose: () => void;
}

interface MealSuggestion {
  id: string;
  name: string;
}

export function SlotEditor({
  calendarType,
  weekStartDate,
  dayOfWeek,
  slotType,
  currentMealName,
  isSkipped,
  skipNote: currentSkipNote,
  onClose,
}: SlotEditorProps) {
  const [mode, setMode] = useState<"search" | "skip">(
    isSkipped ? "skip" : "search"
  );
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [skipNote, setSkipNote] = useState(currentSkipNote || "");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/meals/search?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch {
        setSuggestions([]);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  async function handleAssign(mealId: string) {
    setLoading(true);
    await assignMealToSlot({
      calendarType,
      weekStartDate,
      dayOfWeek,
      slotType,
      mealId,
    });
    onClose();
  }

  async function handleSkip() {
    setLoading(true);
    await skipSlot({
      calendarType,
      weekStartDate,
      dayOfWeek,
      slotType,
      skipNote: skipNote || undefined,
    });
    onClose();
  }

  async function handleClear() {
    setLoading(true);
    await clearSlot({ calendarType, weekStartDate, dayOfWeek, slotType });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-xl sm:rounded-xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
            {dayOfWeek} — {slotType}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg"
          >
            &times;
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("search")}
            className={`flex-1 py-2 text-sm rounded-lg ${
              mode === "search"
                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Assign meal
          </button>
          <button
            onClick={() => setMode("skip")}
            className={`flex-1 py-2 text-sm rounded-lg ${
              mode === "skip"
                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                : "text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Skip
          </button>
        </div>

        {mode === "search" && (
          <div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meals..."
              autoFocus
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {suggestions.length > 0 && (
              <ul className="mt-2 max-h-48 overflow-y-auto space-y-1">
                {suggestions.map((meal) => (
                  <li key={meal.id}>
                    <button
                      type="button"
                      onClick={() => handleAssign(meal.id)}
                      disabled={loading}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                      {meal.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query.length > 0 && suggestions.length === 0 && (
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">No meals found.</p>
            )}
          </div>
        )}

        {mode === "skip" && (
          <div className="space-y-3">
            <input
              type="text"
              value={skipNote}
              onChange={(e) => setSkipNote(e.target.value)}
              placeholder="Note (optional, e.g. 'eating out')"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSkip}
              disabled={loading}
              className="w-full rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Mark as skipped"}
            </button>
          </div>
        )}

        {(currentMealName || isSkipped) && (
          <button
            onClick={handleClear}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-500 px-4 py-2 text-sm text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Clear slot
          </button>
        )}
      </div>
    </div>
  );
}
