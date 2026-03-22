import {
  startOfWeek,
  addWeeks,
  subWeeks,
  format,
  parseISO,
  addDays,
} from "date-fns";

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export const DAY_FULL_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function getMonday(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function formatWeekStart(date: Date): string {
  return format(getMonday(date), "yyyy-MM-dd");
}

export function getCurrentWeekStart(): string {
  return formatWeekStart(new Date());
}

export function getNextWeekStart(): string {
  return format(getMonday(addWeeks(new Date(), 1)), "yyyy-MM-dd");
}

export function getPreviousWeekStartFrom(weekStart: string): string {
  return format(subWeeks(parseISO(weekStart), 1), "yyyy-MM-dd");
}

export function getNextWeekStartFrom(weekStart: string): string {
  return format(addWeeks(parseISO(weekStart), 1), "yyyy-MM-dd");
}

export function getWeekEndDate(weekStart: string): string {
  return format(addDays(parseISO(weekStart), 6), "yyyy-MM-dd");
}

export function formatDateRange(weekStart: string): string {
  const start = parseISO(weekStart);
  const end = addDays(start, 6);
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

export function getDayDate(weekStart: string, dayIndex: number): string {
  return format(addDays(parseISO(weekStart), dayIndex), "MMM d");
}

export function isCurrentWeek(weekStart: string): boolean {
  return weekStart === getCurrentWeekStart();
}

export function isPastWeek(weekStart: string): boolean {
  return weekStart < getCurrentWeekStart();
}
