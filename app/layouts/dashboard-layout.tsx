import { NavLink, Outlet, useOutletContext } from 'react-router'
import { useApi, type TResponse } from '~/hooks/useApi'
import { useEffect } from 'react'
import { useSocket } from '~/hooks/useSocket'
import { useProtectedLayoutContext } from './protected-layout'
import type { TSocket } from '~/types/socket.types'
import { Button } from '~/components/ui/button'

const navItems = [
  {
    href: '/dashboard',
    label: 'Chat',
    icon: '💬',
  },
  {
    href: '/dashboard/calendar',
    label: 'Calendar',
    icon: '📅',
  },
  {
    href: '/dashboard/photos',
    label: 'Photos',
    icon: '📸',
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: '⚙️',
  },
]

export default function DashboardLayout() {
  const { me } = useProtectedLayoutContext()
  const { socket } = useSocket()

  // socket io for testing purposes only
  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        console.log('DEBUG: (DashboardLayout) - line 60 - message', message)
      })
    }
  }, [socket])

  useEffect(() => {
    if (socket && me) {
      console.log('DEBUG: (DashboardLayout) - line 83 - me', me)
      socket.on('roomJoined', (message) => {
        console.log('DEBUG: (DashboardLayout) - line 85 - joinRoom', message)
      })
      socket.emit('joinRoom', me.id)
    }
  }, [socket, me])

  return (
    <div className='flex h-full w-full'>
      <Sidebar me={me} socket={socket} />
      <Outlet context={{ me, socket }} />
    </div>
  )
}

export const useDashboardLayoutContext = () => {
  const context = useOutletContext<{
    me: TResponse<'/api/v1/users/me'> | null
    socket: TSocket | null
  }>()
  if (!context) {
    throw new Error(
      'useDashboardLayoutContext must be used inside a route that is a child of dashboard layout'
    )
  }
  return context
}

function NavList({ socket }: { socket: TSocket | null }) {
  const { fetchWithAuth } = useApi()

  const ConnectionIndicator = () => {
    return (
      <span className='absolute right-2 top-1/2 -translate-y-1/2'>
        {socket === null ? (
          <div className='w-2 h-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
        ) : socket.connected ? (
          <div className='w-2 h-2 rounded-full bg-green-500' />
        ) : (
          <div className='w-2 h-2 rounded-full bg-red-500' />
        )}
      </span>
    )
  }

  return (
    <nav className='space-y-2'>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className='block px-4 py-2 rounded hover:bg-gray-700 relative'
        >
          <span className='mr-2'>{item.icon}</span>
          {item.label}
          {item.label === 'Chat' && <ConnectionIndicator />}
        </NavLink>
      ))}
      <Button
        onClick={() => {
          fetchWithAuth('/api/v1/users/me')
        }}
      >
        test get me
      </Button>
    </nav>
  )
}

const Sidebar = ({
  me,
  socket,
}: {
  me: TResponse<'/api/v1/users/me'> | null
  socket: TSocket | null
}) => {
  return (
    <div className='w-64 bg-gray-800 text-white p-4 flex flex-col'>
      <div className='flex flex-col gap-1 mb-8'>
        <div className='text-xl font-bold'>Dashboard</div>
        <div className='text-sm text-gray-400'>{me?.email}</div>
      </div>
      <NavList socket={socket} />
    </div>
  )
}
