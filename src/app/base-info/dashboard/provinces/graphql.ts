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

// Province Type
export interface ProvinceType {
  id: number;
  name: string;
  code: string;
}

// Province List
export interface AllProvincesOrder {
  name?: "ASC" | "DESC";
  code?: "ASC" | "DESC";
}

export interface AllProvincesFilter {
  name?: QueryFilter;
  code?: QueryFilter;
}

export interface AllProvincesVariables extends PaginationVariable {
  order?: AllProvincesOrder[];
  where?: { and?: AllProvincesFilter[]; or?: AllProvincesFilter[] } | null;
}

export const allProvincesQuery: TypedDocumentNode<
  AllRowQuery<ProvinceType>,
  AllProvincesVariables
> = gql`
  query allProvinces(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $order: [ProvinceDTOSortInput!]
    $where: ProvinceDTOFilterInput
  ) {
    result: allProvinces(
      first: $first
      after: $after
      last: $last
      before: $before
      where: $where
      order: $order
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
        name
        prefixNumber
        __typename
      }
      __typename
    }
  }
`;
//province List (NoPaged)
// interface AllProvincesNoPage {
//   AllProvincesNoPage: ProvinceType[];
// }

interface AllProvincesNoPageVariable {
  name?: string;
}

export const allProvincesNoPageQuery: TypedDocumentNode<
  AllRowQueryNoPaginate<ProvinceType>,
  AllProvincesNoPageVariable
> = gql`
  query allProvincesNoPage {
    result: allProvincesNoPage {
      id
      name
      prefixNumber
    }
  }
`;
// Province By ID
export const provinceByIdQuery: TypedDocumentNode<
  ResultById<ProvinceType>,
  IdVariable
> = gql`
  query provinceById($id: Int!) {
    result: provinceById(id: $id) {
      id
      name
      prefixNumber
    }
  }
`;

// Add New Province
export interface AddNewProvinceVariable {
  name: string;
  prefixNumber: string;
}

export const addNewProvinceMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<AddNewProvinceVariable>
> = gql`
  mutation addNewProvinceMutation($input: CreateNewProvinceInput!) {
    response: createProvince(input: $input) {
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

// Update Province
export interface UpdateProvinceVariable {
  id: number;
  name: string;
  prefixNumber: string;
}

export const updateProvinceMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<UpdateProvinceVariable>
> = gql`
  mutation updateProvince($input: UpdateProvinceInput!) {
    response: updateProvince(input: $input) {
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
// delete Province

export const deleteProvinceMutation: TypedDocumentNode<
  ResultData<number>,
  InputIdVariable
> = gql`
  mutation deleteProvince($input: DeleteProvinceInput!) {
    response: deleteProvince(input: $input) {
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
