import { AuthProvider, VerifyAuthKeyProps } from './../../../domain/providers/auth-provider'
import { UnauthorizedError } from '@/common/domain/errors/unauthorized-error'
import { NextFunction, Request, Response } from 'express'
import { container } from 'tsyringe'

export function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new UnauthorizedError('Token not provided')
  }

  //split the token from the Bearer
  //By default the token on header is defined as 'Bearer fkjsfkhjgsadfa.hfjagsfjask.afsddagas'
  const [, access_token] = authHeader.split(' ')

  const AuthProvider: AuthProvider = container.resolve('AuthProvider')
  const verifyReturn: VerifyAuthKeyProps = AuthProvider.verifyAuthKey(access_token)

  if (!verifyReturn.is_valid) {
    throw new UnauthorizedError('Invalid token')
  }

  req.user = {
    id: user_id,
  }

  return next()
}
