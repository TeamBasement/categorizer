import { Category, CategoryObject } from "../types/category";
import { getResponse } from "./ai";

enum AIStyle {
  "serious",
  "funny",
}

interface AICategoryOptions {
  /** The style for the responses. */
  style?: AIStyle;

  /** A hint for the types of categories that should be generated. */
  categoryHint?: string;

  /** Explicit categories that should be used. */
  categories?: string[];

  /** Exclude generation of specific categories. Useful for trigger a new category. */
  excludeCatories?: string[];
}

/**
 * Categorizes each object into its own category.
 */
const getCategoriesIdentity = (objects: CategoryObject[]): Category[] => {
  const categoriesMap: Record<string, Category> = {};

  objects.forEach((obj) => {
    if (!categoriesMap[obj]) {
      categoriesMap[obj] = { name: obj, objects: [obj] };
    } else {
      categoriesMap[obj].objects.push(obj);
    }
  });

  return Object.values(categoriesMap);
};

/**
 * Categorizes objects using AI.
 */
const getCategoriesAI = async (
  objects: CategoryObject[],
  options: AICategoryOptions
): Promise<Category[]> => {
  let prompt = `You are helping to categorize objects. Assign each object to a category.`;

  if (options.style === AIStyle.funny) {
    prompt += " Make it funny!";
  }

  if (options.categoryHint) {
    prompt += ` Hint: ${options.categoryHint}.`;
  }

  if (options.categories) {
    prompt += ` Use these categories if possible: ${options.categories.join(", ")}.`;
  }

  if (options.excludeCatories) {
    prompt += ` Avoid these categories: ${options.excludeCatories.join(", ")}.`;
  }

  prompt += ` Use the following json response: {"categories" [{name: 'CATEGORY_NAME', objects: ['OBJECT1', 'OBJECT2'...]}]}`;

  const response = await getResponse<{ categories: Category[] }>(
    prompt,
    objects.join("\n")
  );

  return response.categories;
};

/**
 * Gets categories for a set of objects based on the chosen strategy.
 */
export const getCategories = async (
  objects: CategoryObject[],
  strategy: "identity" | "ai"
): Promise<Category[]> => {
  switch (strategy) {
    case "identity":
      return getCategoriesIdentity(objects);
    case "ai":
      return getCategoriesAI(objects);
    default:
      throw new Error("Invalid strategy");
  }
};
