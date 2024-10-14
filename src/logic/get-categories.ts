import { Category, CategoryObject } from "../types/category";
import { getResponse } from "./ai";

export enum AIStyle {
  "serious",
  "funny",
}

export interface AICategoryOptions {
  /** The style for the responses. */
  style?: AIStyle;

  /** What class of objects this is. */
  classHint?: string;

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
  options?: AICategoryOptions
): Promise<Category[]> => {
  let prompt = `You are helping to categorize objects.\
Assign each object to a category. There must be at least 2 categories.\
If you do not know the category, add it to a special 'Unkown' category.`;

  if (options?.categories) {
    // All of the options relate to categry generation.
    // If we get them explicitly, don't bother with the rest
    prompt += ` Use these categories if possible: ${options.categories.join(
      ", "
    )}.`;
  } else {
    if (options?.categoryHint) {
      prompt += ` These are all ${options.classHint}`;
    }
    if (options?.style === AIStyle.funny) {
      prompt += " Make it funny!";
    }
    if (options?.categoryHint) {
      prompt += ` Hint: ${options.categoryHint}.`;
    }
    if (options?.excludeCatories) {
      prompt += ` Avoid these categories: ${options.excludeCatories.join(
        ", "
      )}.`;
    }
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
  strategy: "identity" | "ai",
  options?: AICategoryOptions
): Promise<Category[]> => {
  switch (strategy) {
    case "identity":
      return getCategoriesIdentity(objects);
    case "ai":
      return getCategoriesAI(objects, options);
    default:
      throw new Error("Invalid strategy");
  }
};
