import { Outlet, useOutletContext } from 'react-router'
import type { Route } from './+types/protected-layout'
import { useApi, type TResponse } from '~/hooks/useApi'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '~/contextProviders/authContextProvider'

export default function ProtectedLayout() {
  const [me, setMe] = useState<TResponse<'/api/v1/users/me'> | null>(null)
  const { fetchWithAuth } = useApi()
  const { accessToken } = useContext(AuthContext)

  // todo: move to auth context or other context provider
  const onGetMe = async () => {
    if (!accessToken) {
      return
    }
    const data = await fetchWithAuth('/api/v1/users/me')
    setMe(data)
  }

  useEffect(() => {
    onGetMe()
  }, [accessToken])

  return <Outlet context={{ me }} />
}

export const useProtectedLayoutContext = () => {
  const context = useOutletContext<{
    me: TResponse<'/api/v1/users/me'> | null
  }>()
  if (!context) {
    throw new Error(
      'useProtectedLayoutContext must be used inside a route that is a child of protected layout'
    )
  }
  return context
}
