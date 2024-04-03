import { UseGuards, UsePipes } from '@nestjs/common';
import {
  Args, Mutation, Query, Resolver,
} from '@nestjs/graphql';
import { Roles } from '../basic-auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../basic-auth/guards/GqlAuth.guard';
import { AuthValidationPipe } from '../basic-auth/pipes/basic-auth.pipe';
import { ChangeImageDto } from './dto/ChangeImageDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { DeleteUserDto } from './dto/DeleteUser.dto';
import { PostUserDto } from './dto/PostUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UsersService } from './users.service';
import {
  postUserValidationSchema,
  updateUserValidationSchema,
  deleteUserValidationSchema,
  changeUserPasswordValidationSchema,
  changeUserImageValidationSchema,
} from './validations/userValidations';

@Resolver('User')
export class UserResolver {
  constructor(
        private usersService: UsersService,
  ) {
    //  Constructor
  }

  @Query('Users')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor', 'Viewer')
  async getUsers(
    @Args('page', { nullable: true }) page: number,
    @Args('limit', { nullable: true }) limit: number,
    @Args('orderBy', { nullable: true }) orderBy: string,
  ) {
    const options = {
      page: page || 1,
      limit: limit || 10,
    };
    return this.usersService.getUsers(options, orderBy);
  }

  @Query('User')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor', 'Viewer')
  async getUserById(@Args('id', { nullable: false }) id: string) {
    return this.usersService.getUserById(id);
  }

  @Mutation('postUser')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor')
  @UsePipes(new AuthValidationPipe(postUserValidationSchema))
  async postUser(@Args() data: PostUserDto) {
    return this.usersService.postUser(data);
  }

  @Mutation('updateUser')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor')
  @UsePipes(new AuthValidationPipe(updateUserValidationSchema))
  async updateUser(@Args() data: UpdateUserDto) {
    return this.usersService.updateUser(data);
  }

  @Mutation('changePassword')
  @UseGuards(GqlAuthGuard)
  @UsePipes(new AuthValidationPipe(changeUserPasswordValidationSchema))
  async changePassword(@Args() data: ChangePasswordDto) {
    return this.usersService.changePassword(data);
  }

  @Mutation('changeUserImage')
  @UseGuards(GqlAuthGuard)
  @UsePipes(new AuthValidationPipe(changeUserImageValidationSchema))
  async changeUserImage(@Args() data: ChangeImageDto) {
    return this.usersService.changeUserImage(data);
  }

  @Mutation('deleteUser')
  @UseGuards(GqlAuthGuard)
  @Roles('Admin', 'Editor')
  @UsePipes(new AuthValidationPipe(deleteUserValidationSchema))
  async deleteUser(@Args() data: DeleteUserDto) {
    return this.usersService.deleteUser(data.id);
  }
}
