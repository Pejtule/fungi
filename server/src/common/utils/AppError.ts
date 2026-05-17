export class AppError extends Error {
  status: number
  publicMessage: string
  details?: unknown

  constructor(
    message: string,
    status = 500,
    publicMessage = message,
    details?: unknown
  ) {
    super(message)
    this.status = status
    this.publicMessage = publicMessage
    this.details = details
  }
}
