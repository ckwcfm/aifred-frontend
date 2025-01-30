import { useContext, useMemo } from 'react'
import { NavLink, useActionData, useFetcher, useLoaderData } from 'react-router'

export default function Navbar() {
  const { accessToken } = useLoaderData()
  const isLogin = useMemo(() => !!accessToken, [accessToken])
  return (
    <nav className='navbar bg-black text-white flex justify-between p-4'>
      <div className='flex flex-col'>
        <div className='text-xl font-bold'>AiFred</div>
        <div className='text-xs text-gray-400 italic'>
          Your Digital Butler, At Your Service
        </div>
      </div>
      <div className='flex gap-2'>
        <NavLink to='/' end>
          Home
        </NavLink>
        {!isLogin && (
          <NavLink to='/auth/login' end>
            Login
          </NavLink>
        )}
        {isLogin && (
          <NavLink to='/logout' end>
            Logout
          </NavLink>
        )}
      </div>
    </nav>
  )
}
