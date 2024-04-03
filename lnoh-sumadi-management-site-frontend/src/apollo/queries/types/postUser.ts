/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: postUser
// ====================================================

export interface postUser_postUser {
  __typename: "User";
  id: string;
}

export interface postUser {
  postUser: postUser_postUser | null;
}

export interface postUserVariables {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  role: number;
  status: boolean;
  imageUrl?: string | null;
}
