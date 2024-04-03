/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLatestAccounts
// ====================================================

export interface getLatestAccounts_LatestAccounts_docs {
  __typename: "Account";
  id: string;
  isEnabled: boolean;
  institution: any;
}

export interface getLatestAccounts_LatestAccounts {
  __typename: "AccountPaginated";
  docs: (getLatestAccounts_LatestAccounts_docs | null)[] | null;
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface getLatestAccounts {
  LatestAccounts: getLatestAccounts_LatestAccounts | null;
}

export interface getLatestAccountsVariables {
  limit?: number | null;
}
