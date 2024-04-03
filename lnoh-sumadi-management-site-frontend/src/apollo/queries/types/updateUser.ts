/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateUser
// ====================================================

export interface updateUser_updateUser {
  __typename: "User";
  id: string;
}

export interface updateUser {
  updateUser: updateUser_updateUser | null;
}

export interface updateUserVariables {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: number | null;
  acceptTerms?: boolean | null;
  status?: boolean | null;
  imageUrl?: string | null;
}
