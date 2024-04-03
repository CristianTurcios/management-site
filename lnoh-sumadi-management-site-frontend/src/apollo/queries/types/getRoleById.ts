/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRoleById
// ====================================================

export interface getRoleById_Role {
  __typename: "Role";
  id: string;
  role: string;
}

export interface getRoleById {
  Role: getRoleById_Role | null;
}

export interface getRoleByIdVariables {
  id: string;
}
