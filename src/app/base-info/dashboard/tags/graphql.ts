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

// رابط برای تعریف ترتیب مرتب‌سازی برچسب‌ها
export interface AllTagsOrder {
  name?: string;
  status?: string;
}

// رابط برای تعریف فیلترهای جستجو برای برچسب‌ها
export interface AllTagsFilter {
  name?: QueryFilter;
  status?: QueryFilter;
}

// رابط برای متغیرهای کوئری دریافت تمام برچسب‌ها با صفحه‌بندی
export interface AllTagsVariables extends PaginationVariable {
  order?: AllTagsOrder[];
  where?: { and?: AllTagsFilter[] } | { or?: AllTagsFilter[] } | null;
}

// کوئری برای دریافت تمام برچسب‌ها با پشتیبانی از صفحه‌بندی
export const allTagsQuery: TypedDocumentNode<
  AllRowQuery<TagType>,
  AllTagsVariables
> = gql`
  query allTagsQuery(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: [TagDTOSortInput!]
    $where: TagDTOFilterInput
  ) {
    result: allTags(
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
        status
      }
    }
  }
`;

// رابط برای متغیرهای کوئری بدون صفحه‌بندی
interface AllTagsNoPagedVariable {
  name: string;
}

// کوئری برای دریافت تمام برچسب‌ها بدون صفحه‌بندی
export const allTagsNoPagedQuery: TypedDocumentNode<
  AllRowQueryNoPaginate<TagType>,
  AllTagsNoPagedVariable
> = gql`
  query allTagsNoPagedQuery($name: String!) {
    result: allTagsNoPage(
      where: { name: { contains: $name }, and: [{ status: { eq: ACTIVE } }] }
      order: { name: ASC }
    ) {
      id
      name
      status
    }
  }
`;

// کوئری برای دریافت یک برچسب خاص بر اساس شناسه
export const tagByIdQuery: TypedDocumentNode<
  ResultById<TagType>,
  IdVariable
> = gql`
  query tagbyidQuery($id: Int!) {
    result: tagById(id: $id) {
      name
      status
      id
    }
  }
`;

// رابط برای متغیرهای میوتیشن افزودن برچسب جدید
export interface AddNewTagVariable {
  id?: number;
  name: string;
  status: ActiveStatusType;
}

// میوتیشن برای افزودن یک برچسب جدید

export const addNewTagMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<AddNewTagVariable>
> = gql`
  mutation addtagsMutation($input: CreateNewTagInput!) {
    response: createTag(input: $input) {
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

// رابط برای متغیرهای میوتیشن به‌روزرسانی برچسب
export interface UpdateTagVariable {
  id: number;
  name: string;
  status: ActiveStatusType;
}

// میوتیشن برای به‌روزرسانی یک برچسب
export const updateTagMutation: TypedDocumentNode<
  ResultData<number>,
  InputVariable<UpdateTagVariable>
> = gql`
  mutation updatetagsMutation($input: UpdateTagInput!) {
    response: updateTag(input: $input) {
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

// میوتیشن برای حذف یک برچسب

export const deleteTagMutation: TypedDocumentNode<
  ResultData<number>,
  InputIdVariable
> = gql`
  mutation deletetagsMutation($input: DeleteTagInput!) {
    response: deleteTag(input: $input) {
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
