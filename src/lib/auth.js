import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week in seconds

export function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
}

export function setTokenCookie(res, token) {
  const cookie = serialize('authToken', token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.headers.append('Set-Cookie', cookie);
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function createRegistrationToken(phone) {
  return jwt.sign({ phone, phoneVerified: true, purpose: 'registration' }, JWT_SECRET, {
    expiresIn: '15m',
  });
}

export function verifyRegistrationToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.purpose === 'registration') {
      return decoded;
    }
    return null;
  } catch (err) {
    return null;
  }
}