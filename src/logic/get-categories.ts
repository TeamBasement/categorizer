import { Category, CategoryObject } from "../types/category";
import { Configuration, OpenAIApi } from "openai";

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
const getCategoriesAI = async (objects: CategoryObject[]): Promise<Category[]> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `Categorize the following objects into groups: ${JSON.stringify(objects)}`;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.5,
    });

    const categoriesJson = response.data.choices[0].text?.trim();
    if (!categoriesJson) {
      throw new Error("Failed to get a valid response from OpenAI");
    }

    const categories: Category[] = JSON.parse(categoriesJson);
    return categories;
  } catch (error) {
    console.error("Error categorizing objects with AI:", error);
    throw error;
  }
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
