/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateAccount
// ====================================================

export interface updateAccount_updateAccount {
  __typename: "Account";
  id: string;
  isEnabled: boolean;
  institution: any;
  services: any;
  courses: (string | null)[] | null;
  updatedAt: any | null;
  createdAt: any | null;
  proctorTimeZone: string;
}

export interface updateAccount {
  updateAccount: updateAccount_updateAccount | null;
}

export interface updateAccountVariables {
  id: string;
  account: any;
}
