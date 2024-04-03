/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAccounts
// ====================================================

export interface getAccounts_Accounts_docs {
  __typename: "Account";
  id: string;
  isEnabled: boolean;
  institution: any;
}

export interface getAccounts_Accounts {
  __typename: "AccountPaginated";
  docs: (getAccounts_Accounts_docs | null)[] | null;
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface getAccounts {
  Accounts: getAccounts_Accounts | null;
}

export interface getAccountsVariables {
  page?: number | null;
  limit?: number | null;
  byRegion?: (string | null)[] | null;
  byStatus?: (string | null)[] | null;
}
