type ProductCategoryType = {
  id: number;
  name: string;
  parentId: number | null;
  parent?: {
    id: number;
    name: string;
  } | null;
  level?: number;
  slug?: string | null;
  children?: ProductCategoryType[];
};
