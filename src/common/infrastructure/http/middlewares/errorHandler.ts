import { NextFunction, Request, Response } from 'express'
import { AppError } from '@/common/domain/errors/app-error'
import { MulterError } from 'multer'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  if (err instanceof MulterError) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
    })
  }

  console.error(err)

  //Status code 500 if it's an unknown error
  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' })
}
