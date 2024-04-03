import { UseGuards } from '@nestjs/common';
import {
  Args, Mutation, Query, Resolver,
} from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { UserJwtDto } from '../../shared/dto/UserJwt.dto';
import { Roles } from '../basic-auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../basic-auth/guards/GqlAuth.guard';
import { CurrentUser } from '../basic-auth/decorators/user.decorator';
import { Filter } from './schemas/Filter';

const passwordGenerator = require('generate-password');

@Resolver('Account')
export class AccountResolver {
  constructor(
      private accountsService: AccountsService,
  ) {
    //  Constructor
  }

  @Query('Accounts')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor', 'Viewer')
  async getAccounts(
    @Args('page', { nullable: true }) page: number,
    @Args('limit', { nullable: true }) limit: number,
    @Args('byRegion', { nullable: true }) byRegion: string[],
    @Args('byStatus', { nullable: true }) byStatus: string[],
  ) {
    const pagination = {
      page: page || 1,
      limit: limit || 10,
    };
    const filters: Filter = {
      byRegion,
      byStatus,
    };
    return this.accountsService.getAccounts(pagination, filters);
  }

  @Query('LatestAccounts')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor', 'Viewer')
  async getLatestAccounts(
    @Args('limit', { nullable: true }) limit: number,
  ) {
    return this.accountsService.getLatestAccounts(limit || 10);
  }

  @Query('generatePassword')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor')
  async generatePassword(
    @Args('passwordLength', { nullable: false }) passwordLength: number,
    @Args('symbols', { nullable: false }) symbols: boolean,
    @Args('lowerCase', { nullable: false }) lowerCase: boolean,
    @Args('upperCase', { nullable: false }) upperCase: boolean,
    @Args('numbers', { nullable: false }) numbers: boolean,
    @Args('excludeSimilarCharacters', { nullable: false }) excludeSimilarCharacters: boolean,
  ): Promise<string> {
    const options = {
      length: passwordLength || 16,
      numbers: numbers || false,
      uppercase: upperCase || false,
      lowercase: lowerCase || false,
      excludeSimilarCharacters: excludeSimilarCharacters || false,
      symbols: symbols || false,
      strict: true,
    };
    const passwordGenerated = passwordGenerator.generate(options);
    return passwordGenerated;
  }

  @Query('Account')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor', 'Viewer')
  async getAccountById(@Args('id', { nullable: false }) id: string) {
    return this.accountsService.getAccountById(id);
  }

  @Mutation('postAccount')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor')
  async postAccount(@Args() data, @CurrentUser() user: UserJwtDto) {
    return this.accountsService.postAccount(data.account, user);
  }

  @Mutation('updateAccount')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor')
  async updateAccount(@Args() data, @CurrentUser() user: UserJwtDto) {
    return this.accountsService.updateAccount(data.id, data.account, user);
  }

  @Mutation('deleteAccount')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor')
  async deleteAccount(@Args('id', { nullable: false }) id: string) {
    return this.accountsService.deleteAccount(id);
  }

  @Query('accountsByRegion')
  @UseGuards(GqlAuthGuard)
  async getAccountsByRegions() {
    return this.accountsService.getAccountsByRegion();
  }

  @Query('Timezones')
  @UseGuards(GqlAuthGuard)
  async getTimezones() {
    return this.accountsService.getTimeZones();
  }

  @Query('CollectionsId')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor', 'Viewer')
  async getCollectionsId() {
    return this.accountsService.getRekognitionCollectionsId();
  }
}
