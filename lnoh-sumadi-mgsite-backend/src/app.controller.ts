import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './modules/basic-auth/decorators/roles.decorator';
import { JwtAuthGuard } from './modules/basic-auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/basic-auth/guards/roles.guard';
import { version, name } from '../package.json';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Welcome!';
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/protected')
  @Roles('Admin', 'Viewer')
  getHelloProtectedRoute(): string {
    return 'Welcome to a protected route!';
  }

  @Get('/version')
  getVersion(): any {
    return { name, version };
  }
}
