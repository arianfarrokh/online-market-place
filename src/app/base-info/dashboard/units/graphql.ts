import {
  AllRowQuery,
  IdVariable,
  PaginationVariable,
  QueryFilter,
  ResultById,
  ResultData,
} from "@/graphql/query-types";
import { gql, TypedDocumentNode } from "@apollo/client";

export interface AllUnitsOrder {
  name?: string;
}
export interface AllUnitsFilter {
  name?: QueryFilter;
}

export interface AllUnitsVariables extends PaginationVariable {
  order: [AllUnitsOrder?];
  where?: { and: AllUnitsFilter[] } | { or: AllUnitsFilter[] } | null;
}

export const allUnitsQuery: TypedDocumentNode<
  AllRowQuery<UnitType>,
  AllUnitsVariables
> = gql`
  query allUnits(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: [UnitDTOSortInput!]
    $where: UnitDTOFilterInput
  ) {
    result: allUnits(
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
        unitName
      }
    }
  }
`;
interface AllUnitsNoPaged {
  allUnitsNoPaged: UnitType[];
}

interface AllUnitsNoPagedVariable {
  unitName: string;
}

export const allUnitsNoPagedQuery: TypedDocumentNode<
  AllUnitsNoPaged,
  AllUnitsNoPagedVariable
> = gql`
  query allUnitsNoPaged($unitName: String) {
    allUnitsNoPaged(
      where: { unitName: { contains: $unitName } }
      order: { unitName: ASC }
    ) {
      id
      unitName
    }
  }
`;

export const unitByIdQuery: TypedDocumentNode<
  ResultById<UnitType>,
  IdVariable
> = gql`
  query unitById($id: Int!) {
    result: unitById(id: $id) {
      id
      unitName
    }
  }
`;

export interface AddNewUnitVariable {
  unitName: string;
}

export const addNewUnitMutation: TypedDocumentNode<
  ResultData<number>,
  AddNewUnitVariable
> = gql`
  mutation ($unitName: String!) {
    response: createUnit(input: { unitName: $unitName }) {
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

export interface UpdateUnitVariable {
  id: number;
  unitName: string;
}

export const updateUnitMutation: TypedDocumentNode<
  ResultData<number>,
  UpdateUnitVariable
> = gql`
  mutation updateUnitMutation($id: Int!, $unitName: String!) {
   response: updateUnit(input: { id: $id, unitName: $unitName }) {
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

export const deleteUnitMutation: TypedDocumentNode<
  ResultData<number>,
  IdVariable
> = gql`
  mutation deleteUnitMutation($id: Int!) {
    response: deleteUnit(id: $id) {
      result {
        id
        __typename
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
