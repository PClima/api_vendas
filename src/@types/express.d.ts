//Request override to include the user id on the request object
declare namespace Express {
  export interface Request {
    user: {
      id: string
    }
  }
}
