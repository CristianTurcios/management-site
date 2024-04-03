/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUserById
// ====================================================

export interface getUserById_User {
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

export interface getUserById {
  User: getUserById_User | null;
}

export interface getUserByIdVariables {
  id: string;
}
