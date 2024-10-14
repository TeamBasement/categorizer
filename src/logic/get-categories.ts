import { Category, CategoryObject } from "../types/category";

/**
 * Categorizes each object into its own category.
 */
const identityCategory = (objects: CategoryObject[]): Category[] => {
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
const aiCategory = (objects: CategoryObject[]): Category[] => {
  // AI categorization logic goes here
  return [];
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
      return identityCategory(objects);
    case "ai":
      return aiCategory(objects);
    default:
      throw new Error("Invalid strategy");
  }
};
