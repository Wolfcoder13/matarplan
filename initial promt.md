# Matarplan — Weekly Meal Prep Scheduler

Build this incrementally in the following order:
1. Database schema and seed script
2. Authentication and route protection
3. Meals CRUD (create, view, edit, delete meals and their ingredients)
4. Weekly meal planning (assign meals to slots, skip slots)
5. Shopping list generation (with the full flow described below)
6. Calendar views and week navigation
7. Previous week browsing and week copying

---

## What Is This?

Matarplan is a private family web app for weekly meal planning and grocery shopping. Every Sunday, we sit down and plan what we'll eat for the coming week (Monday–Sunday). We then generate a shopping list from that plan, check what we already have at home, optionally add common household essentials, and head to the store.

There are **three users** who log in: me, my girlfriend, and her mother (who often cooks for us). There are **two meal calendars**: one for the adults (me and my girlfriend) and one for our 1-year-old daughter, because we currently cook separately for her.

Each calendar has **two meal slots per day: lunch and dinner**. No breakfast for now — that may be added later as a future improvement.

A **week always runs Monday through Sunday**. "Current week" means the week containing today. "Upcoming week" means next Monday through Sunday.

---

## User Journey

1. **Plan the week:** On Sunday, we open Matarplan and fill in what we'll eat for each slot (lunch/dinner) across both calendars (adults + daughter) for the upcoming week. We pick from meals we've previously created, or add a new meal on the spot. If we're not cooking for a particular slot, we mark it as skipped with an optional note (e.g., "eating out", "leftovers").

2. **Generate shopping list draft:** When planning is done, we trigger a process that compiles all ingredients from all planned meals into a single shopping list. Each ingredient shows which meal(s) it belongs to. If the same ingredient appears in multiple meals, all meals are listed next to it.

3. **Mark items as already acquired:** We go to the kitchen and check what we already have. Items we don't need to buy get marked as "already acquired" on the list — they stay visible but are visually distinguished (e.g., struck through or greyed out).

4. **Add common household essentials:** Before finalizing, the app shows a list of common items we always tend to need (e.g., toilet paper, paper towels, dish soap). We can toggle any of these onto the shopping list. These are not tied to any specific meal. This is the final step before the list is considered "done."

5. **Shop:** We take the finalized shopping list to the store on our phones and check items off as we go.

6. **During the week:** The home page shows the current week's calendar with planned meals, serving as a daily reminder of what to cook.

---

## Features

### Meals

- Create a meal with a name and a list of ingredients (ingredient names only — no quantities for now; just "onions", "butter", etc.).
- Edit and delete existing meals.
- **Ingredient autocomplete:** When typing an ingredient name while creating or editing a meal, the app should fuzzy-match against all ingredients that already exist in the database and show suggestions in a dropdown. For example, typing "pap" should suggest "Paprika" if it exists. Crucially, this must not interrupt the typing flow — the user can ignore the suggestions entirely and just keep typing to enter a new ingredient. The suggestions are a convenience, not a gate.
- When assigning a meal to a slot, the app suggests previously created meals (autocomplete / searchable list).

### Weekly Planning

- Two separate calendars: one for adults, one for daughter.
- Each day has two slots: lunch and dinner.
- Assign a meal to any slot, or mark it as skipped with an optional note.
- The app should make it easy and fast to fill in the week — this is the core interaction.

### Calendar & Navigation

- The home/front page shows the **current week's** meal calendar prominently.
- There should be easy, obvious navigation to view and plan the **upcoming week**.
- Users can browse **previous weeks** for inspiration.
- Users can **copy a previous week** into the upcoming week as a starting point, then modify it.

### Shopping List

- Generated from all planned meals across both calendars for a given week.
- Each ingredient lists which meal(s) it is needed for.
- If an ingredient appears in multiple meals, all are shown.
- Items can be marked as "already acquired" (visually distinguished but still visible).
- Users can **add extra items** not tied to any meal (freeform additions).
- Final step before finishing: the app presents a configurable list of **common household essentials** (e.g., toilet paper, milk, bread) that can be toggled onto the shopping list. These essentials should be manageable — users can add/remove items from this essentials list over time.
- The shopping list must work excellently on mobile — we will literally be standing in the store checking things off on our phones.

### Previous Weeks

- Browse previous weeks to see what was planned.
- Copy any previous week into the upcoming week as a template.

---

## Future Considerations (Do Not Build Now)

- Ingredient quantities (amounts and units).
- Breakfast slot.
- Meal tags or categories (e.g., "quick", "pasta", "soup", "Icelandic") for filtering and organization.
- Shared real-time collaboration features.

---

## Misc Notes

- The app UI is in **English**, but meal names and ingredients will often be in **Icelandic**. This should not affect the application logic — just treat all user-entered text as UTF-8 strings.
- Since we're skipping quantities, the shopping list shows ingredient names alongside their associated meals. We'll mentally determine amounts based on knowing what we're cooking.
- **Mobile experience is critical.** The entire app should be fully responsive, but the shopping list screen in particular must be optimized for phone use in a store — large tap targets, easy check-off, comfortable to use one-handed.

---

## Tech Stack & Architecture

- **Framework:** Next.js (App Router)
- **Hosting:** Vercel
- **Database:** Vercel Postgres
- **ORM:** Drizzle ORM
- **Auth:** NextAuth.js (Auth.js v5) with Credentials provider (email + password). Passwords hashed with bcrypt. Sessions use JWT. This is a private family app — there is no public registration. All routes are protected; unauthenticated users see only the login page.
- **Styling:** Tailwind CSS
- **Language:** TypeScript

---

## Seed Script

Create a seed script that populates the database with:

- **Three users** with default passwords (to be changed after first login):
  - User 1: Andri — email: andri@matarplan.is — password: `changeme1`
  - User 2: Panpan — email: panpan@matarplan.is — password: `changeme2`
  - User 3: Amma Lulu — email: ammalulu@matarplan.is — password: `changeme3`
- **No example meals** — we want a clean slate to populate ourselves.
- **No pre-populated household essentials** — we will add these ourselves through the app.