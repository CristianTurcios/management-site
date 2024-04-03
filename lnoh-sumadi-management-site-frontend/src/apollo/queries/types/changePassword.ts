/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: changePassword
// ====================================================

export interface changePassword_changePassword {
  __typename: "User";
  id: string;
}

export interface changePassword {
  changePassword: changePassword_changePassword | null;
}

export interface changePasswordVariables {
  userId: string;
  oldPassword: string;
  newPassword: string;
}
