import * as bcrypt from 'bcryptjs';

export const validatePasswords = (newPassword: string, oldPassword: string) => {
  const result = bcrypt.compareSync(newPassword, oldPassword);
  return result;
};
