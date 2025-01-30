import { NavLink } from 'react-router'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home() {
  return (
    <>
      <div className='flex flex-col gap-4 w-full h-full items-center justify-center'>
        <div className='text-4xl font-bold'>Home page</div>
        <NavLink
          className='bg-black text-white p-2 rounded hover:scale-105 transition-all'
          to='/protected'
          end
        >
          Protected Page
        </NavLink>
        <NavLink
          className='bg-black text-white p-2 rounded hover:scale-105 transition-all'
          to='/dashboard'
          end
        >
          Dashboard
        </NavLink>
      </div>
    </>
  )
}
