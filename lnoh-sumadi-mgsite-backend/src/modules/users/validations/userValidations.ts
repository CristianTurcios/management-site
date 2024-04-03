import * as Joi from '@hapi/joi';

export const postUserValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  status: Joi.boolean().required(),
  imageUrl: Joi.string().optional().allow(''),
  password: Joi.string().min(6).max(100).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  acceptTerms: Joi.boolean().required(),
  role: Joi.number().required(),
});

export const updateUserValidationSchema = Joi.object({
  id: Joi.string().required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  status: Joi.boolean().optional(),
  imageUrl: Joi.string().optional().allow(''),
  acceptTerms: Joi.boolean().optional(),
  role: Joi.number().optional(),
});

export const deleteUserValidationSchema = Joi.object({
  id: Joi.string().required(),
});

export const changeUserPasswordValidationSchema = Joi.object({
  userId: Joi.string().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export const changeUserImageValidationSchema = Joi.object({
  userId: Joi.string().required(),
  image: Joi.string().required(),
});
