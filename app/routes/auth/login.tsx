import { Button } from '~/components/ui/button'
import { IconInput } from '~/components/ui/inputs/icon-input'
import { PasswordInput } from '~/components/ui/inputs/password-input'
import { Label } from '~/components/ui/label'
import { useContext, useEffect, useState } from 'react'
import { MdOutlineEmail } from 'react-icons/md'
import { data, NavLink, useFetcher } from 'react-router'
import type { Route } from './+types/login'
import { AuthService } from '~/services/AuthService'
import { setSessionTokens } from '~/utilities/session.server'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const { onLogin } = AuthService()
  const credential = await onLogin({ email, password })

  return data(
    { accessToken: credential.accessToken },
    {
      headers: {
        'Set-Cookie': await setSessionTokens(request, {
          accessToken: credential.accessToken,
          refreshToken: credential.refreshToken,
        }),
      },
    }
  )
}

export default function Login({ actionData }: Route.ComponentProps) {
  const [email, setEmail] = useState('ckwcfm@gmail.com')
  const [password, setPassword] = useState('!Abcd12345!')
  const [error, setError] = useState<string | null>(null)
  const fetcher = useFetcher<typeof action>()

  return (
    <div className='flex flex-col justify-center items-center w-full h-full gap-4'>
      <div className='text-4xl font-bold'>AiFred</div>
      <div className='bg-slate-100 flex flex-col p-4 w-1/2 rounded gap-4'>
        <div className='text-2xl font-bold'>LOGIN</div>
        <fetcher.Form method='POST' className='flex flex-col gap-4'>
          <div>
            <Label htmlFor='email'>Email</Label>
            <IconInput
              prependIcon={<MdOutlineEmail />}
              id='email'
              type='text'
              name='email'
              placeholder='Username'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <PasswordInput
              id='password'
              name='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type='submit'>Login</Button>
        </fetcher.Form>
      </div>

      <div className='flex gap-2'>
        <div>Don't have an account? </div>
        <NavLink
          className='cursor-pointer hover:font-bold hover:underline transition-all'
          to='/auth/register'
        >
          Register
        </NavLink>
      </div>
      <div>{error && <p className='text-red-500'>{error}</p>}</div>
    </div>
  )
}
