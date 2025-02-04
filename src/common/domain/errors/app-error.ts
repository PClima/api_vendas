export class AppError extends Error {
  public readonly statusCode: number

  //Default status code is 400(Bad request) if not provided
  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}
