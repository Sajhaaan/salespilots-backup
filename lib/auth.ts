import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { ProductionDB } from './database-production'

export const AUTH_COOKIE = 'sp_session'
const SESSION_TTL_DAYS = 30

// JWT helpers (HS256) for stateless sessions on Vercel
function getJwtSecret(): string | null {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) return null
  return secret
}

function base64UrlEncode(input: Buffer | string): string {
  const buff = Buffer.isBuffer(input) ? input : Buffer.from(String(input))
  return buff.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function signJwtHS256(payload: Record<string, any>, secret: string): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const data = `${encodedHeader}.${encodedPayload}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest()
  const encodedSignature = base64UrlEncode(signature)
  return `${data}.${encodedSignature}`
}

function verifyJwtHS256(token: string, secret: string): { valid: boolean; payload?: any } {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')
    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      return { valid: false }
    }
    const data = `${encodedHeader}.${encodedPayload}`
    const expected = base64UrlEncode(crypto.createHmac('sha256', secret).update(data).digest())
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(encodedSignature))) {
      return { valid: false }
    }
    const json = JSON.parse(Buffer.from(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
    if (typeof json.exp === 'number' && Date.now() >= json.exp * 1000) {
      return { valid: false }
    }
    return { valid: true, payload: json }
  } catch {
    return { valid: false }
  }
}

function generateSalt(length = 16): string {
  return crypto.randomBytes(length).toString('hex')
}

export function hashPassword(password: string): string {
  const salt = generateSalt()
  const iterations = 120_000
  const keylen = 64
  const digest = 'sha512'
  const derived = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex')
  return `pbkdf2$${iterations}$${digest}$${salt}$${derived}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, iterationsStr, digest, salt, hash] = stored.split('$')
    if (scheme !== 'pbkdf2') return false
    const iterations = parseInt(iterationsStr, 10)
    const keylen = Buffer.from(hash, 'hex').length
    const derived = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'))
  } catch {
    return false
  }
}

export async function createSession(userId: string) {
  const jwtSecret = getJwtSecret()
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  // If JWT secret present, use stateless JWT token
  if (jwtSecret) {
    const nowSec = Math.floor(Date.now() / 1000)
    const expSec = Math.floor(expiresAt.getTime() / 1000)
    const token = signJwtHS256({ sub: userId, iat: nowSec, exp: expSec }, jwtSecret)
    return { token, expiresAt }
  }
  // Fallback to DB/file-backed session (demo/dev)
  const token = crypto.randomBytes(32).toString('hex')
  await ProductionDB.createSession(userId, token, expiresAt.toISOString())
  return { token, expiresAt }
}

export async function setAuthCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

export async function clearSession(token: string) {
  const jwtSecret = getJwtSecret()
  if (!jwtSecret && token) {
    // Only attempt DB cleanup if we are not in JWT mode
    await ProductionDB.deleteSession(token)
  }
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}

export async function getAuthUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token) return null
  const jwtSecret = getJwtSecret()
  if (jwtSecret) {
    const { valid, payload } = verifyJwtHS256(token, jwtSecret)
    if (!valid || !payload?.sub) return null
    const user = await ProductionDB.findAuthUserById(payload.sub)
    return user || null
  }
  // Fallback to DB/file-backed session lookup
  const session = await ProductionDB.findSessionByToken(token)
  if (!session) return null
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await ProductionDB.deleteSession(token)
    return null
  }
  const user = await ProductionDB.findAuthUserById(session.userId)
  return user || null
}

export async function findAuthUserByEmail(email: string) {
  return await ProductionDB.findAuthUserByEmail(email.toLowerCase())
}

export async function isAdminUser(request: NextRequest): Promise<boolean> {
  const user = await getAuthUserFromRequest(request)
  return user?.role === 'admin'
}

export async function requireAdmin(request: NextRequest) {
  const user = await getAuthUserFromRequest(request)
  if (!user || user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 }
  }
  return { user }
}

export async function getAuthUserFromCookies() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) return null
  const jwtSecret = getJwtSecret()
  if (jwtSecret) {
    const { valid, payload } = verifyJwtHS256(token, jwtSecret)
    if (!valid || !payload?.sub) return null
    const user = await ProductionDB.findAuthUserById(payload.sub)
    return user || null
  }
  const session = await ProductionDB.findSessionByToken(token)
  if (!session) return null
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await ProductionDB.deleteSession(token)
    return null
  }
  const user = await ProductionDB.findAuthUserById(session.userId)
  return user || null
}


