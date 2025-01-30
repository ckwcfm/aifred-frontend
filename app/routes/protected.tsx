import { NavLink, redirect, useFetcher, useOutletContext } from 'react-router'
import { Button } from '~/components/ui/button'
import type { Route } from './+types/protected'
import { useContext, useState } from 'react'
import { useApi, type TResponse } from '~/hooks/useApi'
import { getSessionTokens } from '~/utilities/session.server'

export async function loader({ request }: Route.LoaderArgs) {
  const { accessToken } = await getSessionTokens(request)
  return { accessToken }
}

export default function Protected({
  loaderData,
  matches,
}: Route.ComponentProps) {
  const { accessToken } = loaderData
  const { fetchWithAuth } = useApi()
  const [me, setMe] = useState<TResponse<'/api/v1/users/me'> | null>(null)

  const onGetMe = async () => {
    if (!accessToken) {
      return
    }

    const data = await fetchWithAuth('/api/v1/users/me')
    setMe(data)
  }

  return (
    <>
      <div className='flex flex-col gap-4 w-full h-full items-center justify-center'>
        <div className='text-4xl font-bold'>Protected page</div>
        <NavLink
          className='bg-black text-white p-2 rounded hover:scale-105 transition-all'
          to='/'
          end
        >
          Home Page
        </NavLink>
        {/* {create a form to refresh token} */}
        <form method='POST'>
          <input type='hidden' name='refreshToken' value='refreshToken' />
          <Button type='submit'>Refresh Token</Button>
        </form>

        <Button onClick={onGetMe}>Test API</Button>
      </div>
    </>
  )
}
