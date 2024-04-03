import { validate } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { ConfigService } from '@nestjs/config';
import User from '../../entity/user.entity';
import Role from '../../entity/role.entity';
import { EmailService } from '../email/email.service';
import { IUser } from './interfaces/user.interface';
import { IPagination } from '../../shared/interfaces/pagination.interface';
import { hashPassword, randomTokenString } from '../basic-auth/helpers/helpers';
import { IUserImage } from './interfaces/user-image.interface';
import { UserImageDto } from './dto/UserImage.dto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { validatePasswords } from './helpers/helper';
import { ChangeImageDto } from './dto/ChangeImageDto';

@Injectable()
export class UsersService {
  constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        private emailService: EmailService,
        private configService: ConfigService,
  ) {
    // Constructor
  }

  async getUsers(options: IPagination, orderBy: string): Promise<Pagination<User>> {
    if (orderBy) {
      const queryBuilder = this.usersRepository.createQueryBuilder('users');
      queryBuilder.orderBy('users.createdAt', orderBy === 'ASC' ? 'ASC' : 'DESC');
      const users = await paginate(queryBuilder, options);
      const usersWithImages = this.getUserImages(users);
      return usersWithImages;
    }
    const users = await paginate(this.usersRepository, options);
    const usersWithImages = this.getUserImages(users);
    return usersWithImages;
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.usersRepository.findOne({ id }, { relations: ['role'] });
    if (!user) { throw new Error('User not found'); }
    try {
      user.imageUrl = await this.downloadImageFromS3(user.imageUrl);
    } catch (error) {
      user.imageUrl = null;
    }
    return user;
  }

  async postUser(data): Promise<IUser> {
    if (await this.usersRepository.findOne({ email: data.email })) { throw new Error('User already exists'); }
    const role = await this.rolesRepository.findOne({ id: data.role });

    if (!role) { throw new Error('Invalid role id'); }
    let imageLocation = '';
    try {
      const params = {
        image: data.imageUrl,
        name: data.email,
      };
      const response = await this.uploadUserImage(params);
      imageLocation = response.image;
    } catch (error) {
      throw new Error('Something went wrong saving the image.');
    }

    const user = new User();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.acceptTerms = data.acceptTerms;
    user.role = role;
    user.isVerified = false;
    user.status = data.status;
    user.imageUrl = imageLocation;
    user.verificationToken = randomTokenString();
    user.password = hashPassword(data.password);

    const errors = await validate(user);
    if (errors.length > 0) { throw new Error(errors.toString()); }
    try {
      await this.usersRepository.save(user);
      await this.emailService.sendVerificationEmail(user);
      return user;
    } catch (err) {
      throw new Error('Something went wrong when creating user');
    }
  }

  async updateUser(data): Promise<IUser> {
    const user = await this.usersRepository.findOne({ id: data.id }, { relations: ['role'] });

    if (!user) { throw new Error('User not found'); }
    let imageLocation = '';
    try {
      const params = {
        image: data.imageUrl,
        name: data.email,
      };
      const response = await this.uploadUserImage(params);
      imageLocation = response.image;
    } catch (error) {
      throw new Error('Something went wrong saving the image.');
    }

    if (data.email && user.email !== data.email
      && await this.usersRepository.findOne({ email: data.email })) {
      throw new Error('email already taken');
    }

    if (data.role && user.role.role !== data.role) {
      const role = await this.rolesRepository.findOne({ id: data.role });
      if (!role) { throw new Error('Invalid role id'); }
    }

    const newArgs = { ...data };
    delete newArgs.id;
    if (imageLocation) newArgs.imageUrl = imageLocation;
    else delete newArgs.imageUrl;

    Object.assign(user, newArgs);

    try {
      await this.usersRepository.save(user);
      return user;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  }

  async changePassword(data: ChangePasswordDto): Promise<IUser> {
    const user = await this.usersRepository.findOne({ id: data.userId }, { relations: ['role'] });

    if (!user) { throw new Error('Error: User not found'); }

    const arePasswordsValid = validatePasswords(data.oldPassword, user.password);

    if (!arePasswordsValid) { throw new Error('Error: Old password is invalid'); }

    user.password = hashPassword(data.newPassword);
    try {
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      throw new Error('Error: Something went wrong updating new password');
    }
  }

  async changeUserImage(data: ChangeImageDto): Promise<IUser> {
    const user = await this.usersRepository.findOne({ id: data.userId }, { relations: ['role'] });

    if (!user) { throw new Error('Error: User not found'); }

    try {
      const params = {
        image: data.image,
        name: user.email,
      };
      const response = await this.uploadUserImage(params);
      user.imageUrl = response.image;
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      throw new Error('Something went wrong saving the image.');
    }
  }

  async deleteUser(id: string): Promise<IUser> {
    const user = await this.usersRepository.findOne({ id });

    if (!user) { throw new Error('Error: User not found'); }

    try {
      await this.usersRepository.remove(user);
      user.id = id;
      return user;
    } catch (err) {
      throw new Error('Error: Something went wrong on deleting');
    }
  }

  async uploadUserImage(userImage: UserImageDto): Promise<IUserImage> {
    const { image, name } = userImage;

    if (!image) return { image: '' };

    const s3 = new S3();
    const base64Data = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const imageFormat = image.split(';')[0].split('/')[1];
    const params : PutObjectRequest = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: `${name}.${imageFormat}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${imageFormat}`,
    };
    const { Location } = await s3.upload(params).promise();

    const response: IUserImage = { image: Location };
    return response;
  }

  async getUserImages(users): Promise<Pagination<User>> {
    const response = users.items.map(async (user) => {
      const userTemp = { ...user };
      try {
        const image = await this.downloadImageFromS3(userTemp.imageUrl);
        userTemp.imageUrl = image;
      } catch (error) {
        userTemp.imageUrl = '';
      }
      return userTemp;
    });
    const usersWithImages = await Promise.all<User>(response);
    return new Pagination<User>(usersWithImages, users.meta, users.links);
  }

  async downloadImageFromS3(imageUrl: string): Promise<string> {
    const bucket = this.configService.get('AWS_S3_BUCKET_NAME');
    const key = unescape(imageUrl.split('/')[3]);
    const params = {
      Bucket: bucket,
      Key: key,
    };
    const s3 = new S3();
    const { Body } = await s3.getObject(params).promise();
    return `data:image/jpeg;base64,${Body.toString('base64')}`;
  }
}
