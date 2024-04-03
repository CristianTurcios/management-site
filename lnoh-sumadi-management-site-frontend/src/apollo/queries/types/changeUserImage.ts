/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: changeUserImage
// ====================================================

export interface changeUserImage_changeUserImage {
  __typename: "User";
  id: string;
}

export interface changeUserImage {
  changeUserImage: changeUserImage_changeUserImage | null;
}

export interface changeUserImageVariables {
  userId: string;
  image: string;
}
