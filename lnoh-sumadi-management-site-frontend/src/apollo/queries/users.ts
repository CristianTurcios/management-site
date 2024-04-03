import { gql } from '@apollo/client';

const GET_USERS = gql`
query getUsers($page: Int, $limit: Int) {
  Users(page: $page, limit: $limit){
    items{
      id,
      email
      firstName
      lastName,
      isVerified,
      role,
      status,
      imageUrl
    },
    meta
  }
}`;

export const GET_LATEST_USERS = gql`
query getLatestUsers($page: Int, $limit: Int, $orderBy: String){
  Users(page: $page, limit: $limit, orderBy: $orderBy) {
    items{
      id,
      imageUrl,
      firstName,
      lastName, 
      createdAt
    },
    meta,
  }
}`;

export const GET_USER_BY_ID = gql`
query getUserById($id: String!) {
  User(id: $id) {
    id
    email
    firstName
    lastName,
    isVerified,
    role,
    status,
    imageUrl
  }
}`;

export const CREATE_USER = gql`
mutation postUser(
  $firstName: String!,
  $lastName: String!,
  $email: String!,
  $password: String!,
  $confirmPassword: String!,
  $acceptTerms: Boolean!,
  $role: Int!,
  $status: Boolean!
  $imageUrl: String
){
  postUser(
    firstName: $firstName,
    lastName: $lastName, 
    email: $email, 
    password: $password,
    confirmPassword: $confirmPassword,
    acceptTerms: $acceptTerms, 
    role: $role,
    status: $status,
    imageUrl: $imageUrl) {
    id
  }
}
`;

export const UPDATE_USER = gql`
mutation updateUser(
  $id: String!, 
  $email: String, 
  $firstName: String, 
  $lastName: String, 
  $role: Int, 
  $acceptTerms: Boolean, 
  $status: Boolean, 
  $imageUrl: String
){
  updateUser(
    id: $id,
    email: $email, 
    firstName: $firstName,
    lastName: $lastName, 
    role: $role,
    acceptTerms: $acceptTerms, 
    status: $status,
    imageUrl: $imageUrl) {
    id
  }
}
`;

export const DELETE_USER = gql`
mutation deleteUser($id: String!){
  deleteUser(id:$id) {
    id,
  }
}`;

export const CHANGE_USER_PASSWORD = gql`
mutation changePassword(
  $userId: String!,
  $oldPassword: String!,
  $newPassword: String!
  ){
    changePassword(
      userId: $userId,
      oldPassword: $oldPassword,
      newPassword: $newPassword) {
        id
      }
}`;

export const CHANGE_USER_IMAGE = gql`
mutation changeUserImage(
  $userId: String!,
  $image: String!
){
  changeUserImage(
    userId: $userId,
    image: $image
  ){
    id
  }
}`;
export default GET_USERS;
