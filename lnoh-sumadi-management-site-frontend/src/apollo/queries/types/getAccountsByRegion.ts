/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAccountsByRegion
// ====================================================

export interface getAccountsByRegion_accountsByRegion {
  __typename: "AccountsByRegion";
  region: string | null;
  count: number | null;
}

export interface getAccountsByRegion {
  accountsByRegion: (getAccountsByRegion_accountsByRegion | null)[] | null;
}
