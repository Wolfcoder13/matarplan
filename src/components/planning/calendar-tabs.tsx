"use client";

interface CalendarTabsProps {
  active: "adults" | "daughter";
  onChange: (calendar: "adults" | "daughter") => void;
}

export function CalendarTabs({ active, onChange }: CalendarTabsProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
      <button
        onClick={() => onChange("adults")}
        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
          active === "adults"
            ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
            : "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
        }`}
      >
        Adults
      </button>
      <button
        onClick={() => onChange("daughter")}
        className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
          active === "daughter"
            ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
            : "border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
        }`}
      >
        Daughter
      </button>
    </div>
  );
}
