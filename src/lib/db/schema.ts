import {
  pgTable,
  text,
  uuid,
  timestamp,
  date,
  boolean,
  pgEnum,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const calendarTypeEnum = pgEnum("calendar_type", ["adults", "daughter"]);
export const slotTypeEnum = pgEnum("slot_type", ["lunch", "dinner"]);
export const dayOfWeekEnum = pgEnum("day_of_week", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

// --- Users ---
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Meals ---
export const meals = pgTable("meals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  recipe: text("recipe"),
  createdBy: uuid("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Ingredients (normalized, deduplicated) ---
export const ingredients = pgTable("ingredients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Meal-Ingredients junction ---
export const mealIngredients = pgTable(
  "meal_ingredients",
  {
    mealId: uuid("meal_id")
      .references(() => meals.id, { onDelete: "cascade" })
      .notNull(),
    ingredientId: uuid("ingredient_id")
      .references(() => ingredients.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.mealId, t.ingredientId] })]
);

// --- Meal Slots (the weekly plan) ---
export const mealSlots = pgTable(
  "meal_slots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    calendarType: calendarTypeEnum("calendar_type").notNull(),
    weekStartDate: date("week_start_date").notNull(),
    dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
    slotType: slotTypeEnum("slot_type").notNull(),
    mealId: uuid("meal_id").references(() => meals.id, {
      onDelete: "set null",
    }),
    isSkipped: boolean("is_skipped").default(false).notNull(),
    skipNote: text("skip_note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("unique_slot_idx").on(
      t.calendarType,
      t.weekStartDate,
      t.dayOfWeek,
      t.slotType
    ),
  ]
);

// --- Shopping Lists ---
export const shoppingLists = pgTable("shopping_lists", {
  id: uuid("id").defaultRandom().primaryKey(),
  weekStartDate: date("week_start_date").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Shopping List Items ---
export const shoppingListItems = pgTable("shopping_list_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  shoppingListId: uuid("shopping_list_id")
    .references(() => shoppingLists.id, { onDelete: "cascade" })
    .notNull(),
  ingredientId: uuid("ingredient_id").references(() => ingredients.id),
  itemName: text("item_name").notNull(),
  mealAssociations: text("meal_associations").array(),
  isAcquired: boolean("is_acquired").default(false).notNull(),
  isExtraItem: boolean("is_extra_item").default(false).notNull(),
  isEssential: boolean("is_essential").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Household Essentials ---
export const householdEssentials = pgTable("household_essentials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
