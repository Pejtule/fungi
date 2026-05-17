import { signUser } from '../../auth/jwt.js'
import type { Request, Response } from 'express'

export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body

  // 1) Validace vstupu
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    })
  }

  // 2) MOCK ověření uživatele
  // (tady bys normálně kontrolovala DB)
  if (email !== 'petra@example.com' || password !== 'tajneheslo') {
    return res.status(401).json({
      error: 'Invalid credentials'
    })
  }

  // 3) Mock user objekt
  const user = {
    id: '123',
    name: 'Petra',
    email: 'petra@example.com'
  }

  // 4) Vytvoření JWT tokenu
  const token = signUser(user)

  // 5) Nastavení cookie
  res.cookie('auth', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // true na HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dní
  })

  // 6) Odpověď
  return res.json({
    success: true,
    user
  })
}
