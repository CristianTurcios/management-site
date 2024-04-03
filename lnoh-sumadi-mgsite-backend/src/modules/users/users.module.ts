import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UserResolver } from './users.resolver';
import User from '../../entity/user.entity';
import Role from '../../entity/role.entity';
import { EmailModule } from '../email/email.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    MulterModule.register({
      dest: '/upload',
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UsersService,
    UserResolver,
  ],
})
export class UsersModule {}
