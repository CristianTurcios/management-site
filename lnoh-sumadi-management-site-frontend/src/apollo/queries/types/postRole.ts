/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: postRole
// ====================================================

export interface postRole_postRole {
  __typename: "Role";
  id: string;
  role: string;
}

export interface postRole {
  postRole: postRole_postRole | null;
}

export interface postRoleVariables {
  role: string;
}
