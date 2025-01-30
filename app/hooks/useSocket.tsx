import { io, Socket } from 'socket.io-client'
import { useContext, useEffect, useState } from 'react'
import type { TSocket } from '~/types/socket.types'
import { useApi } from './useApi'
import { AuthContext } from '~/contextProviders/authContextProvider'
const BASE_URL = import.meta.env.VITE_API_URL
import { redirect } from 'react-router'

export const useSocket = () => {
  const { accessToken } = useContext(AuthContext)
  const [socket, setSocket] = useState<TSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { onRefreshToken } = useApi()
  useEffect(() => {
    if (!accessToken) {
      return
    }
    if (socket) {
      return
    }
    setIsConnecting(true)

    const newSocket: TSocket = io(BASE_URL, {
      auth: {
        token: accessToken,
      },
    })

    newSocket.on('connect', () => {
      console.log('DEBUG: (useSocket) - line 20 - connected')
      setIsConnected(true)
      setIsConnecting(false)
      setSocket(newSocket)
    })

    newSocket.on('disconnect', () => {
      console.log('DEBUG: (useSocket) - line 27 - disconnected')
      setIsConnected(false)
      setIsConnecting(false)
      setSocket(null)
    })

    newSocket.on('connect_error', async (error) => {
      console.log('DEBUG: (useSocket) - line 33 - connect error', error)
      setIsConnected(false)
      setIsConnecting(false)
      setSocket(null)
      if (error.message === 'Unauthorized') {
        console.log('DEBUG: (useSocket) - line 40 - unauthorized')
        try {
          await onRefreshToken()
        } catch (error) {
          console.log(
            'DEBUG: (useSocket) - line 45 - refresh token error',
            error
          )
          redirect('/login')
        }
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [accessToken])

  return {
    socket,
    isConnected,
    isConnecting,
  }
}
