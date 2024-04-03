/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLatestUsers
// ====================================================

export interface getLatestUsers_Users_items {
  __typename: "User";
  id: string;
  imageUrl: string | null;
  firstName: string;
  lastName: string;
  createdAt: any | null;
}

export interface getLatestUsers_Users {
  __typename: "UserPaginated";
  items: (getLatestUsers_Users_items | null)[] | null;
  meta: any | null;
}

export interface getLatestUsers {
  Users: getLatestUsers_Users | null;
}

export interface getLatestUsersVariables {
  page?: number | null;
  limit?: number | null;
  orderBy?: string | null;
}
