import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import User from '../../../entity/user.entity';
import RefreshToken from '../../../entity/refreshToken.entity';

export const randomTokenString = () => crypto.randomBytes(40).toString('hex');

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

export const generateRefreshToken = (user: User, ipAddress: string) => {
  const refreshToken = new RefreshToken();
  refreshToken.user = user;
  refreshToken.createdByIp = ipAddress;
  refreshToken.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  refreshToken.token = randomTokenString();
  return refreshToken;
};
