/**
 * Session Management Utilities
 *
 * This module provides utilities for managing user sessions using cookie-based storage.
 * It handles authentication tokens (access token and refresh token) in a secure manner.
 */

import { createCookieSessionStorage, type Session } from 'react-router'

/**
 * Session storage configuration using secure HTTP-only cookies
 */
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'session',
    secure: true, // Only sent over HTTPS
    sameSite: 'lax', // Provides CSRF protection
    path: '/',
    httpOnly: true, // Prevents JavaScript access
    secrets: ['Top$ecret@2025!'],
    maxAge: 60 * 60 * 24 * 365, // 1 year expiry
  },
})

/**
 * Retrieves the session from the request cookies
 * @param request - The incoming HTTP request
 * @returns Promise resolving to the session
 */
export async function getSession(request: Request) {
  return await sessionStorage.getSession(request.headers.get('Cookie'))
}

/**
 * Commits session changes and returns the session cookie
 * @param session - The session to commit
 * @returns Promise resolving to the session cookie string
 */
export async function commitSession(session: Session) {
  return await sessionStorage.commitSession(session)
}

/**
 * Destroys the current session
 * @param request - The incoming HTTP request
 * @returns Promise resolving to the cookie string for clearing the session
 */
export async function destroySession(request: Request) {
  const session = await getSession(request)
  return await sessionStorage.destroySession(session)
}

/**
 * Stores authentication tokens in the session
 * @param request - The incoming HTTP request
 * @param tokens - Object containing access and refresh tokens
 * @returns Promise resolving to the session cookie string
 */
export async function setSessionTokens(
  request: Request,
  tokens: { accessToken: string; refreshToken: string }
) {
  const session = await getSession(request)
  session.set('accessToken', tokens.accessToken)
  session.set('refreshToken', tokens.refreshToken)
  return await commitSession(session)
}

/**
 * Retrieves authentication tokens from the session
 * @param request - The incoming HTTP request
 * @returns Object containing access and refresh tokens
 */
export async function getSessionTokens(request: Request) {
  const session = await getSession(request)
  return {
    accessToken: session.get('accessToken'),
    refreshToken: session.get('refreshToken'),
  }
}
