"use client";

import { useState, useRef, useEffect, createRef } from "react";
import { IngredientInput } from "./ingredient-input";
import { createMeal, updateMeal } from "@/lib/actions/meals";

interface MealFormProps {
  meal?: {
    id: string;
    name: string;
    ingredients: { id: string; name: string }[];
  };
}

export function MealForm({ meal }: MealFormProps) {
  const isEditing = !!meal;
  const [ingredientValues, setIngredientValues] = useState<string[]>(
    [...(meal?.ingredients.map((i) => i.name) || []), ""]
  );
  const inputRefs = useRef<React.RefObject<HTMLInputElement | null>[]>([]);

  // Keep refs array in sync with values
  while (inputRefs.current.length < ingredientValues.length) {
    inputRefs.current.push(createRef<HTMLInputElement>());
  }
  inputRefs.current = inputRefs.current.slice(0, ingredientValues.length);

  function updateIngredient(index: number, value: string) {
    const updated = [...ingredientValues];
    updated[index] = value;

    // If typing in the last row and it's now non-empty, add a new empty row
    if (index === updated.length - 1 && value.trim()) {
      updated.push("");
    }

    setIngredientValues(updated);
  }

  function removeIngredient(index: number) {
    const updated = ingredientValues.filter((_, i) => i !== index);
    // Always keep at least one empty row at the end
    if (updated.length === 0 || updated[updated.length - 1].trim()) {
      updated.push("");
    }
    setIngredientValues(updated);
  }

  function focusNext(index: number) {
    const nextIndex = index + 1;
    if (nextIndex < ingredientValues.length) {
      // Focus existing next input
      setTimeout(() => inputRefs.current[nextIndex]?.current?.focus(), 0);
    } else {
      // Add a new row and focus it
      setIngredientValues((prev) => {
        if (prev[prev.length - 1].trim()) {
          return [...prev, ""];
        }
        return prev;
      });
      setTimeout(() => inputRefs.current[nextIndex]?.current?.focus(), 0);
    }
  }

  async function handleSubmit(formData: FormData) {
    formData.delete("ingredients");
    for (const val of ingredientValues) {
      if (val.trim()) {
        formData.append("ingredients", val.trim());
      }
    }

    if (isEditing) {
      await updateMeal(meal.id, formData);
    } else {
      await createMeal(formData);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          Meal name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={meal?.name || ""}
          className="w-full rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Ingredients
        </label>
        <div className="space-y-2">
          {ingredientValues.map((value, index) => (
            <IngredientInput
              key={index}
              value={value}
              onChange={(v) => updateIngredient(index, v)}
              onRemove={() => removeIngredient(index)}
              onEnter={() => focusNext(index)}
              inputRef={inputRefs.current[index]}
              showRemove={!!value.trim()}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isEditing ? "Update meal" : "Create meal"}
      </button>
    </form>
  );
}
