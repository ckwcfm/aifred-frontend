import {
  Outlet,
  redirect,
  useFetcher,
  useLocation,
  useResolvedPath,
  useNavigate,
} from 'react-router'
import Navbar from '~/components/Navbar'
import type { Route } from './+types/app-layout'
import { useContext, useEffect, useMemo, useState } from 'react'
import { refreshTokenResponseSchema } from '~/schemas/auth.schemas'
import { getSessionTokens } from '~/utilities/session.server'
import { AuthContext } from '~/contextProviders/authContextProvider'

export async function loader({ request }: Route.LoaderArgs) {
  console.log('DEBUG: (app-layout/loader) - line 13')
  const { refreshToken, accessToken } = await getSessionTokens(request)
  return { refreshToken, accessToken }
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { refreshToken, accessToken } = loaderData
  const { setAccessToken, setRefreshToken } = useContext(AuthContext)
  const navigate = useNavigate()
  useEffect(() => {
    console.log('DEBUG: (app-layout/useEffect) - line 24')
    if (!accessToken) {
      console.log('DEBUG: (app-layout/useEffect) - line 29 - redirecting')
      navigate('/auth/login', { replace: true })
      return
    }
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
  }, [])

  const location = useLocation()
  console.log('DEBUG: (app-layout/useLocation)', location.pathname)
  const overflowHidden = useMemo(() => {
    return location.pathname.includes('/dashboard')
  }, [location.pathname])

  return (
    <div className='flex flex-col h-screen w-screen'>
      <Navbar />
      <div className={`flex-1  ${overflowHidden ? 'overflow-hidden' : ''}`}>
        <Outlet />
      </div>
    </div>
  )
}
