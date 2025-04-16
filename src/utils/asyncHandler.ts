/**
 * @module Utils
 * @description Utility functions for handling async operations and common tasks.
 */

import { NextFunction, Request, Response } from 'express';

/**
 * Handles async route handlers by wrapping them in a try-catch.
 * @function asyncHandler
 * @memberof module:Utils
 * @param {Function} requestHandler - The async function to handle requests.
 * @returns {Function} Express middleware function that handles errors.
 */

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
