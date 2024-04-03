/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getRoles
// ====================================================

export interface getRoles_Roles {
  __typename: "Role";
  id: string;
  role: string;
}

export interface getRoles {
  Roles: (getRoles_Roles | null)[] | null;
}
