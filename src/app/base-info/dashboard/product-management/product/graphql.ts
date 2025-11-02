import {
  AllRowQuery,
  AllRowQueryNoPaginate,
  IdVariable,
  InputIdVariable,
  InputVariable,
  PaginationVariable,
  QueryFilter,
  ResultById,
  ResultData,
} from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";
import { ProductType } from "./type";

// رابط برای تعریف ترتیب مرتب‌سازی محصولات
export interface AllProductsOrder {
  name?: string;
  price?: string;
  status?: string;
  stock?: string;
  createdAt?: string;
}

// رابط برای تعریف فیلترهای جستجو برای محصولات
export interface AllProductsFilter {
  name?: QueryFilter;
  price?: QueryFilter;
  status?: QueryFilter;
  stock?: QueryFilter;
  createdAt?: QueryFilter;
}

// رابط برای متغیرهای کوئری دریافت تمام محصولات با صفحه‌بندی
export interface AllProductsVariables extends PaginationVariable {
  order?: AllProductsOrder[];
  where?: { and?: AllProductsFilter[] } | { or?: AllProductsFilter[] } | null;
}

// کوئری برای دریافت تمام محصولات با پشتیبانی از صفحه‌بندی
export const allProductsQuery: TypedDocumentNode<
  AllRowQuery<ProductType>,
  AllProductsVariables
> = gql`
  query allProductsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: [ProductDTOSortInput!]
    $where: ProductDTOFilterInput
  ) {
    result: allProducts(
      first: $first
      last: $last
      before: $before
      after: $after
      order: $order
      where: $where
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        name
        image
        price
        status
        stock
        createdAt
        oldPrice
      }
    }
  }
`;

// رابط برای متغیرهای کوئری بدون صفحه‌بندی
interface AllProductsNoPagedVariable {
  name: string;
}

// کوئری برای دریافت تمام محصولات بدون صفحه‌بندی
export const allProductsNoPagedQuery: TypedDocumentNode<
  AllRowQueryNoPaginate<ProductType>,
  AllProductsNoPagedVariable
> = gql`
  query allProductsNoPagedQuery($name: String!) {
    result: allProductsNoPage(
      where: { name: { contains: $name }, and: [{ status: { eq: ACTIVE } }] }
      order: { name: ASC }
    ) {
      id
      name
      image
      price
      status
      stock
      createdAt
      oldPrice
    }
  }
`;

// کوئری برای دریافت یک محصول خاص بر اساس شناسه
export const productByIdQuery: TypedDocumentNode<
  ResultById<ProductType>,
  IdVariable
> = gql`
  query productByIdQuery($id: Int!) {
    result: productById(id: $id) {
      name
      image
      price
      status
      stock
      createdAt
      id
      oldPrice
    }
  }
`;

// رابط برای متغیرهای میوتیشن افزودن محصول جدید
export interface AddNewProductVariable {
  id: number;
  description: string;
  category: string;
  image: File | string;
  imagePreview: string;
  productId: number;
  name: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  stock: number;
  oldPrice: number;
  shippingMethod: string;
  Returnable: string;
  ProductFeatures: string;
  featureValue: string;
  date: string;
  inventory: number;
}

// میوتیشن برای افزودن یک محصول جدید
export const addNewProductMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<AddNewProductVariable>
> = gql`
  mutation addProductsMutation($input: CreateNewProductInput!) {
    response: createProduct(input: $input) {
      result {
        id
      }
      errors {
        code: __typename
        ... on Error {
          message
        }
      }
    }
  }
`;

// رابط برای متغیرهای میوتیشن به‌روزرسانی محصول
export interface UpdateProductVariable {
  id: number;
  name: string;
  image?: string;
  price: number;
  status: ActiveStatusType;
  stock: number;
  createdAt?: string;
  oldPrice?: number; // فیلد جدید برای قیمت قدیمی
}

// میوتیشن برای به‌روزرسانی یک محصول
export const updateProductMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<UpdateProductVariable>
> = gql`
  mutation updateProductsMutation($input: UpdateProductInput!) {
    response: updateProduct(input: $input) {
      result: result {
        id
      }
      errors {
        code: __typename
        ... on Error {
          message
        }
      }
    }
  }
`;

// میوتیشن برای حذف یک محصول
export const deleteProductMutation: TypedDocumentNode<
  ResultData<number>,
  InputIdVariable
> = gql`
  mutation deleteProductsMutation($input: DeleteProductInput!) {
    response: deleteProduct(input: $input) {
      result: result {
        id
      }
      errors {
        code: __typename
        ... on Error {
          message
        }
      }
    }
  }
`;
