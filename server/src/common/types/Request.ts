declare global {
  namespace Express {
    interface Request {
      normalizedQuery?: Record<string, any>
    }
  }
}
 export {}
