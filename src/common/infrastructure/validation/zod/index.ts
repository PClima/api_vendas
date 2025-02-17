import { AppError } from '@/common/domain/errors/app-error'

/**
 *
 * @param schema Object schema to validate the request body fields
 * @param data Object with the request body data
 * @returns Validated data
 */
export function dataValidation(schema: any, data: any) {
  //Execute the validation
  const validatedData = schema.safeParse(data)

  //Validating the request body and return an error if it is invalid
  if (validatedData.success === false) {
    console.error('Invalida params', validatedData.error.format())
    //Throwing an error with the error message for each invalid field
    throw new AppError(
      `${validatedData.error.errors.map(err => {
        return `${err.path} -> ${err.message}`
      })}`,
    )
  }
  return validatedData.data
}
