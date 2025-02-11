import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../error/response-error";

export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let message = err.message;

  if (err instanceof ZodError) {
    status = 400;
    message = `Validation error: ${JSON.stringify(err)}`;
  } else if (err instanceof ResponseError) {
    status = err.status;
    message = err.message;
  }

  res.status(status).json({
    errors: message,
  });
};
