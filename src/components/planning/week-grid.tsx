"use client";

import { useState } from "react";
import { DAYS_OF_WEEK, DAY_LABELS, getDayDate } from "@/lib/utils/dates";
import { CalendarTabs } from "./calendar-tabs";
import { MealSlot } from "./meal-slot";
import type { WeekPlan } from "@/lib/queries/planning";

interface WeekGridProps {
  weekStart: string;
  plan: WeekPlan;
  readOnly?: boolean;
}

export function WeekGrid({ weekStart, plan, readOnly = false }: WeekGridProps) {
  const [activeCalendar, setActiveCalendar] = useState<"adults" | "daughter">(
    "adults"
  );

  const calendarPlan = plan[activeCalendar];

  return (
    <div>
      <CalendarTabs active={activeCalendar} onChange={setActiveCalendar} />

      {/* Desktop: grid layout */}
      <div className="hidden md:grid md:grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={day} className="space-y-1">
            <div className="text-center pb-1 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-200">
                {DAY_LABELS[day]}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                {getDayDate(weekStart, index)}
              </p>
            </div>
            <MealSlot
              calendarType={activeCalendar}
              weekStartDate={weekStart}
              dayOfWeek={day}
              slotType="lunch"
              data={calendarPlan[day].lunch}
              readOnly={readOnly}
            />
            <MealSlot
              calendarType={activeCalendar}
              weekStartDate={weekStart}
              dayOfWeek={day}
              slotType="dinner"
              data={calendarPlan[day].dinner}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden space-y-3">
        {DAYS_OF_WEEK.map((day, index) => (
          <div
            key={day}
            className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                {DAY_LABELS[day]}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-400">
                {getDayDate(weekStart, index)}
              </span>
            </div>
            <div className="p-2 space-y-1">
              <MealSlot
                calendarType={activeCalendar}
                weekStartDate={weekStart}
                dayOfWeek={day}
                slotType="lunch"
                data={calendarPlan[day].lunch}
                readOnly={readOnly}
              />
              <MealSlot
                calendarType={activeCalendar}
                weekStartDate={weekStart}
                dayOfWeek={day}
                slotType="dinner"
                data={calendarPlan[day].dinner}
                readOnly={readOnly}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
