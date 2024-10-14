import { Category, CategoryObject } from "../types/category";

/**
 * Gets categories for a set of objects.
 */
export const getCategories = async (
  objects: CategoryObject[]
): Promise<Category[]> => {
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
