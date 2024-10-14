export type CategoryObject = string;

export interface Category {
  /** The name of the category. */
  name: string;

  /** The objects that belong to this category. */
  objects: CategoryObject[];
}
