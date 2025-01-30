import { redirect, replace } from 'react-router'
import type { Route } from './+types/logout'
import { destroySession } from '~/utilities/session.server'

export async function action({ request }: Route.ActionArgs) {
  return replace('/auth/login', {
    headers: {
      'Set-Cookie': await destroySession(request),
    },
  })
}

export async function loader({ request }: Route.LoaderArgs) {
  return replace('/auth/login', {
    headers: {
      'Set-Cookie': await destroySession(request),
    },
  })
}
