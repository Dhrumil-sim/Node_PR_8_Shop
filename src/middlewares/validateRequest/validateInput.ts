import Joi from 'joi';

// Define the schema for validating the input
export const timeZoneSchema = Joi.object({
  currentTime: Joi.string().required().messages({
    'string.empty': 'Current time is required.',
    'any.required': 'Current time is a required field.',
  }),
  currentTimezone: Joi.string().required().messages({
    'string.empty': 'Current timezone is required.',
    'any.required': 'Current timezone is a required field.',
  }),
  convertToTimezone: Joi.string().required().messages({
    'string.empty': 'Target timezone is required.',
    'any.required': 'Target timezone is a required field.',
  }),
});
