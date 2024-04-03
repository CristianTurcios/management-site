/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUsers
// ====================================================

export interface getUsers_Users_items {
  __typename: "User";
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: any;
  status: boolean;
  imageUrl: string | null;
}

export interface getUsers_Users {
  __typename: "UserPaginated";
  items: (getUsers_Users_items | null)[] | null;
  meta: any | null;
}

export interface getUsers {
  Users: getUsers_Users | null;
}

export interface getUsersVariables {
  page?: number | null;
  limit?: number | null;
}
