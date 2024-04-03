/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAccountById
// ====================================================

export interface getAccountById_Account {
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

export interface getAccountById {
  Account: getAccountById_Account | null;
}

export interface getAccountByIdVariables {
  id: string;
}
