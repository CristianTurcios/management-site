import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../../entity/user.entity';
import Role from '../../entity/role.entity';
import { RegisterDto } from './dto/RegisterAuth.dto';
import RefreshToken from '../../entity/refreshToken.entity';
import { Login, Success } from './interfaces/auth.interface';
import {
  hashPassword,
  randomTokenString,
  generateRefreshToken,
} from './helpers/helpers';
import { EmailService } from '../email/email.service';
import { JwtDto } from '../../shared/dto/Jwt.dto';

@Injectable()
export class BasicAuthService {
  constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
        private jwtService: JwtService,
        private emailService:EmailService,
  ) {
    // Constructor
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email }, { relations: ['role'] });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new HttpException('Email or password invalid', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isVerified || (user.resetToken !== '' && user.resetToken !== null)) {
      throw new HttpException(
        'You must verify your account or complete the change password request',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.status) {
      throw new HttpException(
        'Your account is inactive. Please, contact your administrator.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async login(user: User, ipAddress: string): Promise<Login> {
    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.role,
      },
      sub: user.id,
    };

    const refreshToken = generateRefreshToken(user, ipAddress);

    try {
      await this.refreshTokenRepository.save(refreshToken);
      return { token: this.jwtService.sign(payload), refreshToken: refreshToken.token };
    } catch (err) {
      console.error('/authentication/login ||', err);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async register(register: RegisterDto): Promise<Success> {
    const { email, password, role } = register;

    if (await this.usersRepository.findOne({ email })) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const userRole = await this.roleRepository.findOne({ id: role });
    if (!userRole) {
      throw new HttpException('Invalid role id', HttpStatus.CONFLICT);
    }

    const user = new User();
    user.email = register.email;
    user.firstName = register.firstName;
    user.lastName = register.lastName;
    user.role = userRole;
    user.isVerified = false;
    user.status = register.status;
    user.imageUrl = register.imageUrl;
    user.acceptTerms = register.acceptTerms;
    user.verificationToken = randomTokenString();
    user.password = hashPassword(password);
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new HttpException('Bad Request', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      await this.usersRepository.save(user);
      await this.emailService.sendVerificationEmail(user);
      return { success: 'Registration successful, please check your email for verification instructions' };
    } catch (err) {
      console.error('/authentication/register ||', err);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyEmail(token: string) {
    const user = await this.usersRepository.findOne({ verificationToken: token });

    if (!user) { throw new HttpException('Invalid Token', HttpStatus.NOT_FOUND); }

    user.verified = new Date();
    user.isVerified = true;
    user.verificationToken = '';

    try {
      await this.usersRepository.save(user);
      return;
    } catch (err) {
      console.error('/authentication/verify-email ||', err);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(token: string, ipAddress: string): Promise<Login> {
    const refreshToken = await this.refreshTokenRepository.findOne({ token }, { relations: ['user', 'user.role'] });

    if ((!refreshToken || refreshToken.revoked !== null)
            || Date.now() > refreshToken.expires.getTime()) {
      throw new HttpException('Verification failed', HttpStatus.NOT_FOUND);
    }

    const { user } = refreshToken;
    const newRefreshToken = generateRefreshToken(user, ipAddress);

    refreshToken.revoked = new Date();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    try {
      await this.refreshTokenRepository.save(refreshToken);
      await this.refreshTokenRepository.save(newRefreshToken);
      const payload = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role.role,
        },
        sub: user.id,
      };
      return { token: this.jwtService.sign(payload), refreshToken: newRefreshToken.token };
    } catch (err) {
      console.error('/authentication/refresh-token', err);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async forgotPassword(email: string): Promise<Success> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) { throw new HttpException('User not found', HttpStatus.BAD_REQUEST); }

    user.resetToken = randomTokenString();
    user.isVerified = false;
    user.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      await this.usersRepository.save(user);
      await this.emailService.sendPasswordResetEmail(user);
      return { success: 'Please check your email for password reset instructions' };
    } catch (err) {
      console.error('/authentication/forgot-password ||', err);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(resetToken: string, password) {
    const user = await this.usersRepository.findOne({ resetToken });

    if (!user) { throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED); }

    if (Date.now() > user.resetTokenExpires.getTime()) {
      throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
    }

    user.password = hashPassword(password);
    user.passwordReset = new Date();
    user.resetToken = '';
    user.resetTokenExpires = new Date();
    user.isVerified = true;

    try {
      await this.usersRepository.save(user);
      return;
    } catch (err) {
      console.error('/authentication/change-passwor ||', err);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateResetToken(resetToken: string) {
    const user = await this.usersRepository.findOne({ resetToken });
    if (!user) { throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED); }
  }

  getTokenPayload(token: string): JwtDto {
    return this.jwtService.decode(token) as JwtDto;
  }
}
