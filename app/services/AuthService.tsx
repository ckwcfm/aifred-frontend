import {
  loginSchema,
  registerSchema,
  authErrorSchema,
} from '~/schemas/auth.schemas'
import { credentialSchema } from '~/schemas/user.schemas'

import type {
  TLogin,
  TRegister,
  TAuthService,
} from '~/types/auth.service.types'

const BASE_URL = import.meta.env.VITE_API_URL

export const AuthService = (): TAuthService => {
  const handleLogin = async (input: TLogin) => {
    console.log('BASE_URL', BASE_URL)
    const { email, password } = loginSchema.parse(input)

    const url = `${BASE_URL}/api/v1/auth/login`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await resp.json()

    if (!resp.ok) {
      const { message } = authErrorSchema.parse(data)
      throw new Error(message)
    }
    return credentialSchema.parse(data)
  }

  const handleRegister = async (input: TRegister) => {
    const { email, password } = registerSchema.parse(input)
    const url = `${BASE_URL}/api/v1/auth/register`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await resp.json()

    if (!resp.ok) {
      const { message } = authErrorSchema.parse(data)
      throw new Error(message)
    }

    const user = credentialSchema.parse(data)
    return user
  }

  const handleRefreshToken = async (refreshToken: string) => {
    try {
      const url = `${BASE_URL}/api/v1/auth/refresh-token`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'refresh-token': refreshToken,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }
      const data = await response.json()
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
      }
    } catch (error) {
      // Clear tokens on refresh failure
      throw error
    }
  }

  return {
    onRegister: handleRegister,
    onLogin: handleLogin,
    onRefreshToken: handleRefreshToken,
  }
}
