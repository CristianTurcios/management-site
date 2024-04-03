import {
  Controller, Post, Body, UseGuards,
} from '@nestjs/common';
import { Roles } from '../basic-auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../basic-auth/guards/jwt-auth.guard';
import { RolesGuard } from '../basic-auth/guards/roles.guard';
import { UserImageDto } from './dto/UserImage.dto';
import { UsersService } from './users.service';
@Controller()
export class UserController {
  constructor(private usersService: UsersService) {
    // Constructor
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  @Roles('Admin', 'Editor', 'Viewer')
  async uploadFile(@Body() userImage: UserImageDto): Promise<any> {
    this.usersService.uploadUserImage(userImage);
    return 'Uploaded';
  }
}
