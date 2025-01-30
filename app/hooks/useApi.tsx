import { useContext, useState } from 'react'
import { z } from 'zod'
import { AuthContext } from '~/contextProviders/authContextProvider'
import {
  API_ROUTE_PARAMS,
  API_ROUTES_RESPONSE_SCHEMAS,
  buildRoute,
  type TApiRoutes,
} from '~/schemas/api.routes.shemas'

// API configuration
const BASE_URL = import.meta.env.VITE_API_URL
const MAX_REFRESH_RETRIES = 1

// Define available API routes and their response schemas
export type TResponse<T extends TApiRoutes> = z.infer<
  (typeof API_ROUTES_RESPONSE_SCHEMAS)[T]
>

export const useApi = () => {
  const { accessToken, setRefreshToken, setAccessToken } =
    useContext(AuthContext)
  const [retryCount, setRetryCount] = useState(0)

  // Helper function to refresh the access token
  const onRefreshToken = async () => {
    console.log('Refreshing access token...')
    const url = `/auth/refresh-token`
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to refresh access token')
    }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await response.json()
    setAccessToken(newAccessToken)
    setRefreshToken(newRefreshToken)
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }

  // Handle unauthorized responses by refreshing token
  const handleUnauthorized = async (options: RequestInit) => {
    if (retryCount >= MAX_REFRESH_RETRIES) {
      throw new Error('Maximum token refresh attempts exceeded')
    }

    setRetryCount(retryCount + 1)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await onRefreshToken()

    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: newAccessToken,
      },
    }
  }

  type TApiRouteParams = z.infer<(typeof API_ROUTE_PARAMS)[TApiRoutes]>
  type TApiRouteResponse = z.infer<
    (typeof API_ROUTES_RESPONSE_SCHEMAS)[TApiRoutes]
  >

  // Main fetch function with authentication
  const fetchWithAuth = async <T extends TApiRoutes>(
    path: T,
    params?: z.infer<(typeof API_ROUTE_PARAMS)[T]>,
    options: RequestInit = {}
  ): Promise<TResponse<T>> => {
    if (!accessToken) {
      throw new Error('No access token available')
    }

    let url = `${BASE_URL}${path}`
    if (params) {
      const route = buildRoute(path, params)
      url = `${BASE_URL}${route}`
    }

    const requestOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, requestOptions)

      // Handle unauthorized response
      if (response.status === 401) {
        const updatedOptions = await handleUnauthorized(requestOptions)
        return fetchWithAuth(path, params, updatedOptions)
      }

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`)
      }
      setRetryCount(0)
      const data = await response.json()
      console.log('DEBUG: (useApi/fetchWithAuth) - line 97 | data', data)

      return API_ROUTES_RESPONSE_SCHEMAS[path].parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Invalid API response format:', error)
        throw new Error('Invalid API response format')
      }
      throw error
    }
  }

  return { fetchWithAuth, onRefreshToken }
}
