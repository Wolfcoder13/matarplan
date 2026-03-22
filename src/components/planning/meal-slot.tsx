"use client";

import { useState } from "react";
import { SlotEditor } from "./slot-editor";
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

  const isEmpty = !data;
  const isSkipped = data?.isSkipped;
  const mealName = data?.mealName;

  return (
    <>
      <button
        onClick={() => !readOnly && setEditing(true)}
        disabled={readOnly}
        className={`w-full text-left p-2 rounded-lg text-sm min-h-[40px] transition-colors ${
          isSkipped
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300 italic"
            : mealName
            ? "bg-blue-50 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-800/50"
            : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
        } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
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
    </>
  );
}
