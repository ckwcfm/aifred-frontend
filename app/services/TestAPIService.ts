import { useContext } from 'react'
import { AuthContext } from '~/contextProviders/authContextProvider'

const BASE_URL = import.meta.env.VITE_API_URL

export const TestAPIService = (accessToken: string) => {
  async function invoke() {
    // get cookie
    try {
      const url = `${BASE_URL}/api/v1/users/me`
      if (!accessToken) {
        return
      }
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: accessToken,
        },
      })
      const data = await resp.json()
      // if 401, redirect to refresh token
      console.log('resp status', resp.status)
      if (!resp.ok && resp.status === 401) {
        const refreshResp = await refreshToken()
        if (!refreshResp.ok) {
          throw new Error('Failed to refresh token')
        }

        const { accessToken: newAccessToken } = await refreshResp.json()
        console.log('refreshed accessToken', newAccessToken)

        return await invoke()
      }

      console.log('DEBUG: me', data)
      return data
    } catch (error) {
      return null
    }
  }

  async function refreshToken() {
    console.log('DEBUG: calling refreshToken in useTestAPI')
    const url = `/auth/refresh-token`
    const resp = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    })
    return resp
  }

  return { invoke }
}
