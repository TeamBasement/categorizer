import { Category, CategoryObject } from "../types/category";
import { getResponse } from "./ai";

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
  objects: CategoryObject[]
): Promise<Category[]> => {
  const response = await getResponse<{ categories: Category[] }>(
    `You are helping to categorize objects. Assign each object to a category. There must be at least two categories. For example, programming languages could be compiled vs interpreted.
    Use the following json response: {"categories" [{name: 'CATEGORY_NAME', objects: ['OBJECT1', 'OBJECT2'...]}]Python, JavaScript, Java, C#, C++, Ruby, Go, Rust, Swift, Kotlin, TypeScript, PHP, Dart, R, MATLAB, Scala, Haskell, Lua, Perl, Julia}`,
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
