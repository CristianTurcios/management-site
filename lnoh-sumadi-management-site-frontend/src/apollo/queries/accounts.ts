import { gql } from '@apollo/client';

const GET_PASSWORD = gql`
query getPassword(
    $passwordLength: Int!,
    $upperCase: Boolean!,
    $symbols: Boolean!,
    $lowerCase: Boolean!,
    $numbers: Boolean!,
    $excludeSimilarCharacters: Boolean!
){
    generatePassword(
        passwordLength: $passwordLength,
        upperCase: $upperCase,
        symbols: $symbols,
        lowerCase: $lowerCase,
        numbers: $numbers,
        excludeSimilarCharacters: $excludeSimilarCharacters
    )
}`;

export const GET_ACCOUNTS = gql` 
query getAccounts($page: Int, $limit: Int, $byRegion: [String], $byStatus: [String]) {
  Accounts(page: $page, limit: $limit, byRegion: $byRegion, byStatus: $byStatus) {
    docs{
      id,
      isEnabled,
      institution
    },
    limit,
    page,
    pages,
    total
  }
}`;

export const GET_LATEST_ACCOUNTS = gql` 
query getLatestAccounts($limit: Int) {
  LatestAccounts(limit: $limit) {
    docs{
      id,
      isEnabled,
      institution
    },
    limit,
    page,
    pages,
    total
  }
}`;

export const GET_ACCOUNTS_BY_REGION = gql` 
query getAccountsByRegion {
  accountsByRegion {
    region,
    count,
  }
}`;

export const GET_ACCOUNT_BY_ID = gql`
query getAccountById($id: String!) {
  Account(id: $id) {
    id
    isEnabled,
    institution,
    services,
    courses,
    updatedAt,
    createdAt,
    proctorTimeZone,
    createdBy
    updatedBy
  }
}`;

export const GET_TIMEZONES = gql`
query getTimezones {
  Timezones {
    value,
    label
  }
}`;

export const GET_COLLECTIONS_ID = gql`
query getCollectionsId {
  CollectionsId {
    value,
    label
  }
}`;

export const UPDATE_ACCOUNT = gql` 
mutation updateAccount($id: String!, $account: JSON!) {
  updateAccount(id: $id, account: $account) {
    id
    isEnabled,
    institution,
    services,
    courses,
    updatedAt,
    createdAt,
    proctorTimeZone,
  }
}`;

export const POST_ACCOUNT = gql`
mutation postAccount($account: JSON!){
    postAccount(account: $account) {
        id
        isEnabled,
        institution,
        services,
        courses,
        updatedAt,
        createdAt,
        proctorTimeZone,
        createdBy
        updatedBy
    }
}`;

export default GET_PASSWORD;
