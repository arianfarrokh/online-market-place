import {
  AllRowQuery,
  AllRowQueryNoPaginate,
  IdVariable,
  InputVariable,
  PaginationVariable,
  QueryFilter,
  ResultById,
  ResultData,
} from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

// --- Types ---

export interface AllColorsOrder {
  name?: string;
  colorName?: { name: string };
}

export interface AllColorsFilter {
  name?: QueryFilter;
  colorName?: { name?: QueryFilter };
}

export interface AllColorsVariables extends PaginationVariable {
  order?: AllColorsOrder[];
  // allow partial filters for frontend usage
  where?: {
    and?: Partial<AllColorsFilter>[];
    or?: Partial<AllColorsFilter>[];
  } | null;
}

// --- Helper to convert partials into valid GraphQL where ---

export function buildWhere(
  where?: {
    and?: Partial<AllColorsFilter>[];
    or?: Partial<AllColorsFilter>[];
  } | null
): { and: AllColorsFilter[] } | { or: AllColorsFilter[] } | null | undefined {
  if (!where) return null;

  if (where.and && where.and.length > 0) {
    const and: AllColorsFilter[] = where.and
      .map((f) => ({ ...f }))
      .filter(Boolean);
    if (and.length > 0) return { and };
  }

  if (where.or && where.or.length > 0) {
    const or: AllColorsFilter[] = where.or
      .map((f) => ({ ...f }))
      .filter(Boolean);
    if (or.length > 0) return { or };
  }

  return null;
}

// --- Queries ---

export const allColorsQuery: TypedDocumentNode<
  AllRowQuery<ColorType>,
  AllColorsVariables
> = gql`
  query allcolorsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: [ColorDTOSortInput!]
    $where: ColorDTOFilterInput
  ) {
    result: allColors(
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
        __typename
      }
      nodes {
        id
        colorName
        colorCode
        __typename
      }
      __typename
    }
  }
`;

interface AllColorsNoPagedVariable {
  colorName: string;
}

export const allColorsNoPagedQuery: TypedDocumentNode<
  AllRowQueryNoPaginate<ColorType>,
  AllColorsNoPagedVariable
> = gql`
  query allColorsNoPaged($colorName: String) {
    allColorsNoPaged(
      where: { colorName: { contains: $colorName } }
      order: { colorName: ASC }
    ) {
      id
      colorName
      colorCode
    }
  }
`;

export const colorByIdQuery: TypedDocumentNode<
  ResultById<ColorType>,
  IdVariable
> = gql`
  query colorById($id: Int!) {
    result: colorById(id: $id) {
      id
      colorName
      colorCode
    }
  }
`;

// --- Mutations ---

export interface CreateColorVariable {
  colorName: string;
  colorCode: string;
}

export const createColorMutation: TypedDocumentNode<
  ResultData<number>,
  CreateColorVariable
> = gql`
  mutation createColorMutation($colorCode: String!, $colorName: String!) {
    response: createColor(
      input: { colorCode: $colorCode, colorName: $colorName }
    ) {
      result {
        id
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

export interface UpdateColorVariable {
  id: number;
  colorName: string;
  colorCode: string;
}

export const updateColorMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<UpdateColorVariable>
> = gql`
  mutation updatecolorMutation($input: UpdateColorInput!) {
    response: updateColor(input: $input) {
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

export const deleteColorMutation: TypedDocumentNode<
  ResultData<number>,
  IdVariable
> = gql`
  mutation deleteColorMutation($id: Int!) {
    response: deleteColor(input: { id: $id }) {
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
