import jwt from 'jsonwebtoken'
export type UserPayload = {
  id: string
  name: string
  email: string
}

const SECRET = 'super-tajne-heslo' // dej do .env

export function signUser(user: any) {
  return jwt.sign(user, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as UserPayload
}
