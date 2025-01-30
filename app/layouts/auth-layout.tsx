import { Outlet, redirect } from 'react-router'
import type { Route } from './+types/auth-layout'
import { getSessionTokens } from '~/utilities/session.server'

export async function loader({ request }: Route.LoaderArgs) {
  const { refreshToken } = await getSessionTokens(request)
  if (refreshToken) {
    return redirect('/dashboard')
  }
  return
}

export default function AuthLayout() {
  return <Outlet />
}
