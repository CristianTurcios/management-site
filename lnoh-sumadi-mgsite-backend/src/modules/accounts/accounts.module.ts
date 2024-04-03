import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsService } from './accounts.service';
import AccountSchema from './schemas/Account.schema';
import { AccountResolver } from './accounts.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'accounts', schema: AccountSchema }])],
  providers: [
    AccountResolver,
    AccountsService,
  ],
})
export class AccountsModule {}
