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

// * Cities List
export interface AllCitiesOrder {
  name?: string
  province?:{
    name:string
  }
}

export interface AllCitiesFilter {
  name?: QueryFilter;
  province?:{
    name:QueryFilter
  }
}

export interface AllCitiesVariables extends PaginationVariable {
  order?: AllCitiesOrder[];
  where?: { and?: AllCitiesFilter[]; or?: AllCitiesFilter[] } | null;
}

export const allCitiesQuery: TypedDocumentNode<
  AllRowQuery<CityType>,
  AllCitiesVariables
> = gql`
  query allCitiesQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: [CityDTOSortInput!]
    $where: CityDTOFilterInput
  ) {
    result: allCities(
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
        province {
          id
          name
          prefixNumber
        }
      }
    }
  }
`;

interface AllCitiesNoPageVariable {
  name?: string;
}
interface AllProvincesVariables {
  name?: string;
}

export const allCitiesNoPageQuery: TypedDocumentNode<
  AllRowQueryNoPaginate<CityType>,
  AllCitiesNoPageVariable
> = gql`
  query allCitiesNoPageQuery($name: String) {
    result: allCitiesNoPage(
      where: { name: { contains: $name } }
      order: { name: ASC }
    ) {
      id
      name
      provinceId
    }
  }
`;

export const allProvincesNoPagedQuery: TypedDocumentNode<
  AllRowQueryNoPaginate<ProvinceType>,
  AllProvincesVariables
> = gql`
  query allProvinceQuerty {
    result: allProvincesNoPage {
      id
      name
    }
  }
`;

// * City By ID
export const cityByIdQuery: TypedDocumentNode<
  ResultById<CityType>,
  IdVariable
> = gql`
  query cityByIdQuery($id: Int!) {
    result: cityById(id: $id) {
      id
      name
      province {
        id
        name
      }
    }
  }
`;

// * Add New City
export interface AddNewCityVariable {
  name: string;
  provinceId: number;
}

export const addNewCityMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<AddNewCityVariable>
> = gql`
  mutation addNewCityMutation($input: CreateNewCityInput!) {
    response: createCity(input: $input) {
      result {
        id
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`;

// * Update City
export interface UpdateCityVariable {
  id: number;
  name: string;
  provinceId: number;
}

export const updateCityMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<UpdateCityVariable>
> = gql`
  mutation updateCityMutation($input: UpdateCityInput!) {
    response: updateCity(input: $input) {
      result {
        id
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`;

// * Delete City
export const deleteCityMutation: TypedDocumentNode<
  ResultData<number>,
  InputIdVariable
> = gql`
  mutation deleteCityMutation($input: DeleteCityInput!) {
    response: deleteCity(input: $input) {
      result {
        id
      }
      errors {
        ... on Error {
          message
        }
      }
    }
  }
`;
