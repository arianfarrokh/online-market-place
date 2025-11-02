import {
  AllRowQuery,
  IdVariable,
  PaginationVariable,
  QueryFilter,
  ResultById,
  ResultData,
} from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export interface AllProductCategoriesOrder {
  parent?: {
    name?: string;
  };
  name?: string;
  level?: string;
  slug?: string;
}
export interface AllProductCategoriesFilter {
  parent?: {
    name?: QueryFilter;
  };
  name?: QueryFilter;
  level?: QueryFilter;
  slug?: QueryFilter;
}

export interface AllProductCategoriesVariables extends PaginationVariable {
  order: [AllProductCategoriesOrder?];
  where?:
    | { and: AllProductCategoriesFilter[] }
    | { or: AllProductCategoriesFilter[] }
    | null;
}

export const allProductCategoriesQuery: TypedDocumentNode<
  AllRowQuery<ProductCategoryType>,
  AllProductCategoriesVariables
> = gql`
  query allProductCategoriesQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: [ProductCategoryDTOSortInput!]
    $where: ProductCategoryDTOFilterInput
  ) {
    result: allProductCategories(
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
        name
        id
        parent {
          id
          name
        }
        parentId
        level
        slug
      }
    }
  }
`;
interface AllProductCategoriesNoPaged {
  allProductCategoriesNoPaged: ProductCategoryType[];
}

interface AllProductCategoriesNoPagedVariable {
  name: string;
}

export const allProductCategoriesNoPagedQuery: TypedDocumentNode<
  AllProductCategoriesNoPaged,
  AllProductCategoriesNoPagedVariable
> = gql`
  query allProductCategoriesNoPageQuery {
    allProductCategoriesNoPage {
      slug
      sortOrder
      id
      name
      level
      parentId
      parent {
        name
        id
      }
    }
  }
`;

export const productCategoryByIdQuery: TypedDocumentNode<
  ResultById<ProductCategoryType>,
  IdVariable
> = gql`
  query productCategoryById($id: Int!) {
    result: productCategoryById(id: $id) {
      id
      name
      parentId
      parent {
        id
        name
      }
    }
  }
`;

export interface CreateProductCategoryVariable {
  parentId?: number | null;
  name: string;
}

export const CreateProductCategoryMutation: TypedDocumentNode<
  ResultData<number>,
  CreateProductCategoryVariable
> = gql`
  mutation createProductCategoryMutation($name: String!, $parentId: Int) {
    response: createProductCategory(
      input: { name: $name, parentId: $parentId }
    ) {
      result {
        id
        __typename
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

export interface UpdateProductCategoryVariable {
  id: number;
  parentId?: number | null;
  name: string;
  sortOrder: number | 1;
}

export const updateProductCategoryMutation: TypedDocumentNode<
  ResultData<number>,
  UpdateProductCategoryVariable
> = gql`
  mutation updateProductCategoryMutation(
    $id: Int!
    $name: String!
    $parentId: Int
  ) {
    updateProductCategory(
      input: { id: $id, name: $name, parentId: $parentId }
    ) {
      result {
        id
      }
      errors {
        __typename
        ... on Error {
          message
          __typename
        }
      }
    }
  }
`;

export const deleteProductCategoryMutation: TypedDocumentNode<
  ResultData<number>,
  IdVariable
> = gql`
  mutation deleteProductCategoryMutation($id: Int!) {
    response: deleteProductCategory(input: { id: $id }) {
      result {
        id
        __typename
      }
      errors {
        __typename
        ... on Error {
          message
        }
      }
    }
  }
`;
