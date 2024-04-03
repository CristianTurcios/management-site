import {
  Controller, Get, Post, Body, UsePipes, Request, Res,
  UseGuards, HttpCode, Query, HttpException, HttpStatus, Ip, Param, Redirect,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/RegisterAuth.dto';
import { ForgotPasswordDto } from './dto/ForgotPassword.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { BasicAuthService } from './basic-auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthValidationPipe } from './pipes/basic-auth.pipe';
import {
  loginSchema,
  verifyEmailValidation,
  forgotPasswordValidation,
  registerValidationSchema,
  changePasswordValidation,
  validateResetTokenValidation,
} from './validations/authValidations';
import { Success } from './interfaces/auth.interface';

@Controller('authentication')
export class BasicAuthController {
  constructor(
    private configService: ConfigService,
    private basicAuthService: BasicAuthService,
  ) {
    // Constructor
  }

    @UsePipes(new AuthValidationPipe(registerValidationSchema))
    @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<Success> {
    return this.basicAuthService.register(registerDto);
  }

    @UseGuards(LocalAuthGuard)
    @UsePipes(new AuthValidationPipe(loginSchema))
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Ip() ipAddress, @Request() req, @Res() res: Response) {
      const auth = await this.basicAuthService.login(req.user, ipAddress);
      res.header('token', auth.token);
      res.header('refreshToken', auth.refreshToken);
      res.send(auth);
    }

    @UsePipes(new AuthValidationPipe(verifyEmailValidation))
    @Get('verify-email')
    @Redirect()
    @HttpCode(HttpStatus.NO_CONTENT)
    async verifyEmail(@Query() query) {
      const { token } = query;
      await this.basicAuthService.verifyEmail(token);
      return { url: this.configService.get('CLIENT_URL') };
    }

    @Get('refresh-token')
    async refreshToken(@Request() req, @Res() res: Response) {
      if (!('refreshtoken' in req.headers)) {
        throw new HttpException('Token was not provided', HttpStatus.BAD_REQUEST);
      }

      const refreshTokentoken = req.headers.refreshtoken;
      const ipAddress = req.ip;
      const auth = await this.basicAuthService.refreshToken(refreshTokentoken, ipAddress);

      res.header('token', auth.token);
      res.header('refreshToken', auth.refreshToken);
      res.send(auth);
    }

    @UsePipes(new AuthValidationPipe(forgotPasswordValidation))
    @Post('forgot-password')
    async forgotPassword(@Body() body: ForgotPasswordDto): Promise<Success> {
      return this.basicAuthService.forgotPassword(body.email);
    }

    @Post('change-password/:token')
    async changePassword(@Body() body: ChangePasswordDto, @Param('token') token) {
      const validate = new AuthValidationPipe(changePasswordValidation);
      let data = body;
      data.token = token;
      data = validate.transform(data);
      return this.basicAuthService.changePassword(data.token, data.password);
    }

    @UsePipes(new AuthValidationPipe(validateResetTokenValidation))
    @Get('validate-reset-token')
    async validateResetToken(@Body() resetToken) {
      return this.basicAuthService.validateResetToken(resetToken);
    }
}
