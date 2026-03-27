"use client";

import { useState } from "react";
import { SlotEditor } from "./slot-editor";
import { RecipeModal } from "@/components/meals/recipe-modal";
import type { SlotData } from "@/lib/queries/planning";

interface MealSlotProps {
  calendarType: "adults" | "daughter";
  weekStartDate: string;
  dayOfWeek: string;
  slotType: "lunch" | "dinner";
  data: SlotData | null;
  readOnly?: boolean;
}

export function MealSlot({
  calendarType,
  weekStartDate,
  dayOfWeek,
  slotType,
  data,
  readOnly = false,
}: MealSlotProps) {
  const [editing, setEditing] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  const isEmpty = !data;
  const isSkipped = data?.isSkipped;
  const mealName = data?.mealName;
  const hasMeal = !!mealName && !isSkipped;

  function handleClick() {
    if (readOnly) {
      if (data?.mealId) setShowRecipe(true);
    } else {
      setEditing(true);
    }
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={handleClick}
          className={`w-full text-left p-2 rounded-lg text-sm min-h-[40px] transition-colors ${
            isSkipped
              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300 italic"
              : mealName
              ? "bg-blue-50 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-800/50"
              : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
          } ${readOnly && !hasMeal ? "cursor-default" : "cursor-pointer"}`}
        >
          <span className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase block mb-0.5">
            {slotType}
          </span>
          {isSkipped ? (
            <span>Skipped{data.skipNote ? ` — ${data.skipNote}` : ""}</span>
          ) : mealName ? (
            <span className="font-medium">{mealName}</span>
          ) : (
            <span>—</span>
          )}
        </button>

        {!readOnly && hasMeal && data?.mealId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRecipe(true);
            }}
            className="absolute top-1 right-1 p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
            title="View recipe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path
                fillRule="evenodd"
                d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {editing && (
        <SlotEditor
          calendarType={calendarType}
          weekStartDate={weekStartDate}
          dayOfWeek={dayOfWeek}
          slotType={slotType}
          currentMealName={mealName || null}
          isSkipped={!!isSkipped}
          skipNote={data?.skipNote || null}
          onClose={() => setEditing(false)}
        />
      )}

      {showRecipe && data?.mealId && (
        <RecipeModal
          mealId={data.mealId}
          onClose={() => setShowRecipe(false)}
        />
      )}
    </>
  );
}
