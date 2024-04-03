
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface Account {
    id: string;
    isEnabled: boolean;
    institution: JSON;
    services: JSON;
    courses?: string[];
    updatedAt?: Date;
    createdAt?: Date;
    proctorTimeZone: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface AccountPaginated {
    docs?: Account[];
    total: number;
    limit: number;
    page: number;
    pages: number;
}

export interface AccountsByRegion {
    region?: string;
    count?: number;
}

export interface Timezone {
    value?: string;
    label?: string;
}

export interface CollectionId {
    value?: string;
    label?: string;
}

export interface Role {
    id: string;
    role: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: JSON;
    createdAt?: Date;
    updatedAt?: Date;
    acceptTerms: boolean;
    isVerified: boolean;
    status: boolean;
    imageUrl?: string;
}

export interface UserPaginated {
    items?: User[];
    meta?: JSON;
    links?: JSON;
}

export interface IQuery {
    User(id: string): User | Promise<User>;
    Users(page?: number, limit?: number, orderBy?: string): UserPaginated | Promise<UserPaginated>;
    Account(id: string): Account | Promise<Account>;
    Accounts(page?: number, limit?: number, byRegion?: string[], byStatus?: string[]): AccountPaginated | Promise<AccountPaginated>;
    LatestAccounts(limit?: number): AccountPaginated | Promise<AccountPaginated>;
    Role(id: string): Role | Promise<Role>;
    Roles(): Role[] | Promise<Role[]>;
    generatePassword(passwordLength: number, upperCase: boolean, symbols: boolean, lowerCase: boolean, numbers: boolean, excludeSimilarCharacters: boolean): string | Promise<string>;
    accountsByRegion(): AccountsByRegion[] | Promise<AccountsByRegion[]>;
    Timezones(): Timezone[] | Promise<Timezone[]>;
    CollectionsId(): CollectionId[] | Promise<CollectionId[]>;
}

export interface IMutation {
    postUser(firstName: string, lastName: string, email: string, password: string, confirmPassword: string, acceptTerms: boolean, role: number, status: boolean, imageUrl?: string): User | Promise<User>;
    deleteUser(id: string): User | Promise<User>;
    updateUser(id: string, email?: string, firstName?: string, lastName?: string, role?: number, acceptTerms?: boolean, status?: boolean, imageUrl?: string): User | Promise<User>;
    changePassword(userId: string, oldPassword: string, newPassword: string): User | Promise<User>;
    changeUserImage(userId: string, image: string): User | Promise<User>;
    postAccount(account: JSON): Account | Promise<Account>;
    deleteAccount(id: string): Account | Promise<Account>;
    updateAccount(id: string, account: JSON): Account | Promise<Account>;
    postRole(role: string): Role | Promise<Role>;
    deleteRole(id: string): Role | Promise<Role>;
    updateRole(id: string, role: string): Role | Promise<Role>;
}

export type JSON = any;
export type Any = any;
export type Upload = any;
