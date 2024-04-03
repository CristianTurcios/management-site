import { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rekognition } from 'aws-sdk';
import { IPagination } from '../../shared/interfaces/pagination.interface';
import { AccountInterface } from './schemas/Account.schema';
import { UserJwtDto } from '../../shared/dto/UserJwt.dto';
import Timezones from './helpers/Timezones';
import {
  accountsEnabledFilter,
  addRegionField,
  getAccountsQuery,
  groupByRegion, sortByCount, splitProctorTimeZone,
} from './helpers/queryHelper';
import { Filter } from './schemas/Filter';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel('accounts') private AccountModel: PaginateModel<AccountInterface>,
  ) {
    // Constructor
  }

  async getAccounts(pagination: IPagination, filter: Filter): Promise<any> {
    const query = getAccountsQuery(filter);

    const accounts = await this.AccountModel.paginate(query, pagination);
    return accounts;
  }

  async getLatestAccounts(limit: number): Promise<any> {
    const options = { sort: { _id: -1 }, limit };
    const accounts = await this.AccountModel.paginate({}, options);
    return accounts;
  }

  async getAccountById(id: string): Promise<AccountInterface> {
    try {
      const account = await this.AccountModel.findById(id) || null;
      return account;
    } catch (error) {
      console.error('getAccountbyId error ||', error);
      throw new Error('Account not found');
    }
  }

  async postAccount(data: AccountInterface, user: UserJwtDto): Promise<AccountInterface> {
    const accountData = data;
    accountData.createdBy = user.email;
    const account = new this.AccountModel(accountData);
    try {
      await account.save();
      return account;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('postAccount error ||', error);
      throw new Error(error);
    }
  }

  async updateAccount(id: string, data: AccountInterface, user: UserJwtDto): Promise<AccountInterface> {
    const accountData = data;
    const account = await this.AccountModel.findById(id);
    if (!account) { throw new Error('Account not found'); }

    if ('institution' in accountData && account.institution.name !== accountData.institution.name
      && await this.AccountModel.findOne({ 'institution.name': accountData.institution.name })) {
      throw new Error('institution.name already taken');
    } else if ('institution' in accountData && account.institution.id !== accountData.institution.id
      && await this.AccountModel.findOne({ 'institution.id': accountData.institution.id })) {
      throw new Error('institution.id already taken');
    }
    const newsArgs = accountData;
    newsArgs.updatedBy = user.email;
    const newAccount = Object.assign(account, newsArgs);
    newAccount.updatedAt = new Date();

    try {
      await newAccount.save();
      return newAccount;
    } catch (error) {
      console.error('updateAccount error ||', error);
      throw new Error(error);
    }
  }

  async deleteAccount(id: string): Promise<AccountInterface> {
    const account = await this.AccountModel.findById(id);
    if (!account) { throw new Error('Account not found'); }

    try {
      await account.remove();
      return account;
    } catch (error) {
      console.error('deleteAccount error ||', error);
      throw new Error(error);
    }
  }

  async getAccountsByRegion() : Promise<any> {
    try {
      const regions = await this.AccountModel.aggregate()
        .match(accountsEnabledFilter)
        .project(splitProctorTimeZone)
        .group(groupByRegion)
        .project(addRegionField)
        .sort(sortByCount);
      return regions;
    } catch (error) {
      throw new Error(error);
    }
  }

  getTimeZones() {
    return Timezones;
  }

  async getRekognitionCollectionsId() {
    const rekognition = new Rekognition();
    const params = {
    };
    const response = await rekognition.listCollections(params).promise();
    const result = response.CollectionIds.map((collection) => ({ value: collection, label: collection }));
    return result;
  }
}
