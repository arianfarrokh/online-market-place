import { ProductCategoryType } from "../../product-categories/page";

type ActiveStatusType = "ACTIVE" | "INACTIVE";

type ProductType = {
  id: number;
  description: string;
  category: ProductCategoryType;
  image: File | string; 
  imagePreview: string; 
  productId: number;
  name: string;
  price: number;
  status: ActiveStatusType;
  stock: number;
  oldPrice: number;
  shippingMethod: string;
  Returnable: string;
  ProductFeatures: string;
  featureValue: string;
  date: string;
  inventory: number;
};
