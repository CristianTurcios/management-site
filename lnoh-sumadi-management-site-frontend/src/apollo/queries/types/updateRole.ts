/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateRole
// ====================================================

export interface updateRole_updateRole {
  __typename: "Role";
  id: string;
  role: string;
}

export interface updateRole {
  updateRole: updateRole_updateRole | null;
}

export interface updateRoleVariables {
  id: string;
  role: string;
}
