/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteRole
// ====================================================

export interface deleteRole_deleteRole {
  __typename: "Role";
  id: string;
  role: string;
}

export interface deleteRole {
  deleteRole: deleteRole_deleteRole | null;
}

export interface deleteRoleVariables {
  id: string;
}
