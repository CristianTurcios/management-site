/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: postAccount
// ====================================================

export interface postAccount_postAccount {
  __typename: "Account";
  id: string;
  isEnabled: boolean;
  institution: any;
  services: any;
  courses: (string | null)[] | null;
  updatedAt: any | null;
  createdAt: any | null;
  proctorTimeZone: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface postAccount {
  postAccount: postAccount_postAccount | null;
}

export interface postAccountVariables {
  account: any;
}
