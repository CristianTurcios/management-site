/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPassword
// ====================================================

export interface getPassword {
  generatePassword: string | null;
}

export interface getPasswordVariables {
  passwordLength: number;
  upperCase: boolean;
  symbols: boolean;
  lowerCase: boolean;
  numbers: boolean;
  excludeSimilarCharacters: boolean;
}
