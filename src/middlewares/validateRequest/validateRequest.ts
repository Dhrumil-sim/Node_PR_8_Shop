import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from 'utils/ApiError';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'VALIDATION_ERROR',
          'Invalid Inputs',
          errors,
        ),
      );
    }

    next();
  };
};
